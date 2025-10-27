import mongoose from "mongoose";
import { Request, Response } from "express";
import Property from "../models/property.model";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { FilterQuery } from "mongoose";
import { IProperty } from "../types/Property.types";
/**
 * ✅ Create new property (Agent/Admin only)
 * Uses MongoDB transactions to ensure atomicity
 */
export const createProperty = async (req: AuthRequest, res: Response): Promise<Response> => {
  let session: mongoose.ClientSession | null = null;

  try {
    // Trim and validate required string fields
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const location = req.body.location?.trim();
    const type = req.body.type?.trim();
    const status = req.body.status?.trim();

    if (!title || !description || !location || !type || !status) {
      return res.status(400).json({ message: "Required fields cannot be empty" });
    }

    // ✅ Validate enum values
    const validTypes = ['House', 'Apartment', 'Land', 'Commercial', 'Other'];
    const validStatuses = ['Available', 'Under Contract', 'Sold', 'Rented'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid property type" });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid property status" });
    }

    // Coerce and validate numeric fields
    const price = Number(req.body.price);
    const bedrooms = Number(req.body.bedrooms || 0);
    const bathrooms = Number(req.body.bathrooms || 0);
    const squareFootage = Number(req.body.squareFootage || 0);

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }
    if (!Number.isFinite(bedrooms) || bedrooms < 0) {
      return res.status(400).json({ message: "Bedrooms must be a non-negative number" });
    }
    if (!Number.isFinite(bathrooms) || bathrooms < 0) {
      return res.status(400).json({ message: "Bathrooms must be a non-negative number" });
    }
    if (!Number.isFinite(squareFootage) || squareFootage <= 0) {
      return res.status(400).json({ message: "Square footage must be a positive number" });
    }

    // Ensure authenticated user
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Start MongoDB session
    session = await mongoose.startSession();
    session.startTransaction();

    // Build property object
    const propertyData = {
      title,
      description,
      price,
      location,
      type,
      status,
      bedrooms,
      bathrooms,
      squareFootage,
      images: req.body.images || [],
      isFeatured: !!req.body.isFeatured,
      agent: req.user._id,
    };

    // Create property document inside transaction
    const property = await Property.create([propertyData], { session });

    // Update agent’s listings within same transaction
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { listings: property[0]._id } },
      { session }
    );

    // Commit transaction if both succeed
    await session.commitTransaction();

    return res.status(201).json({
      message: "Property created successfully",
      property: property[0],
    });
  } catch (error) {
    console.error("Create property transaction error:", error);

    // Rollback changes if anything fails
    if (session) await session.abortTransaction();

    return res.status(500).json({ message: "Server error creating property" });
  } finally {
    // Clean up the session
    if (session) session.endSession();
  }
};



export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      location,
      type,
      status,
      isFeatured,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter: FilterQuery<IProperty> = {};

    // --- Filters ---
    if (location) {
      const escaped = (location as string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
      filter.location = { $regex: new RegExp(escaped, "i") };
    }

    const validTypes = ['House', 'Apartment', 'Land', 'Commercial', 'Other'];
    const validStatuses = ['Available', 'Under Contract', 'Sold', 'Rented'];
    if (type) {
      const types = (type as string).split(","); // support multiple types
      const invalidTypes = types.filter(t => !validTypes.includes(t));
      if (invalidTypes.length > 0) {
        res.status(400).json({ 
          success: false, 
          message: `Invalid property type(s): ${invalidTypes.join(', ')}` 
        });
        return;
      }
      filter.type = { $in: types };
    }
    if (status) {
      const statuses = (status as string).split(",");
      const invalidStatuses = statuses.filter(s => !validStatuses.includes(s));
      if (invalidStatuses.length > 0) {
        res.status(400).json({ 
          success: false, 
          message: `Invalid status(es): ${invalidStatuses.join(', ')}` 
        });
        return;
      }
      filter.status = { $in: statuses };
    }


    if (isFeatured !== undefined) {
      filter.isFeatured = (isFeatured as string).toLowerCase() === "true";
    }

    if (minPrice || maxPrice) {
      const min = Number(minPrice);
      const max = Number(maxPrice);
      if (!isNaN(min) || !isNaN(max)) {
        filter.price = {};
        if (!isNaN(min)) filter.price.$gte = min;
        if (!isNaN(max)) filter.price.$lte = max;
      }
    }

    if (bedrooms) {
      const bd = Number(bedrooms);
      if (!isNaN(bd)) filter.bedrooms = bd;
    }

    if (bathrooms) {
      const ba = Number(bathrooms);
      if (!isNaN(ba)) filter.bathrooms = ba;
    }

    // --- Pagination ---
    const MAX_PAGE_SIZE = 100; // consider moving to config
    const rawPage = Number(page);
    const rawLimit = Number(limit);
    const pageNumber = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const pageSize = Number.isFinite(rawLimit) && rawLimit > 0
     ? Math.min(Math.floor(rawLimit), MAX_PAGE_SIZE)
     : Math.min(10, MAX_PAGE_SIZE);
    const skip = (pageNumber - 1) * pageSize;
    
    // --- Sorting ---
    const allowedSortFields = ['createdAt', 'updatedAt', 'price', 'bedrooms', 'bathrooms', 'title'];
    const sortField = allowedSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    
    const sortOrder: Record<string, 1 | -1> = {};
    sortOrder[sortField] = order === "asc" ? 1 : -1;

    // --- Fetch properties ---
      const properties = await Property.find(filter)
      .lean()
      .populate("agent", "fullName role")
      .sort(sortOrder)
      .skip(skip)
      .limit(pageSize);


    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: pageSize,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};



export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      res.status(400).json({ success: false, message: "Invalid property ID" });
      return;
    }

    const property = await Property.findById(id)
      .populate("agent", "fullName email role"); 

    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ success: false, message: "Failed to fetch property" });
  }
};
