import mongoose from "mongoose";
import { Request, Response } from "express";
import Property from "../models/property.model";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { FilterQuery } from "mongoose";
import { 
  IProperty,
  IUpdatePropertyRequest,
  ListingStatus, 
  PropertyType 
} from "../types/Property.types";
import { 
  uploadMultipleImagesToCloudinary,
  deleteImageFromCloudinary
} from "../lib/cloudinary";
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
    const validTypes: PropertyType[] = ['House', 'Apartment', 'Land', 'Commercial', 'Other'];
    const validStatuses: ListingStatus[] = ['Available', 'Under Contract', 'Sold', 'Rented'];

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

    let imageUrls: string[] = [];
    const files = req.files as Express.Multer.File[] | undefined;
    // ⚙️ Image validations
    if (files && files.length > 0) {
      // 1️⃣ Check count
      if (files.length > 10) {
        return res.status(400).json({ message: "You can upload up to 10 images only" });
      }

      // 2️⃣ Validate MIME type
      const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
      if (files.some((f) => !validMimeTypes.includes(f.mimetype))) {
        return res.status(400).json({
          message: "Invalid file type — only JPG, PNG, or WEBP allowed",
        });
      }

      // 3️⃣ Upload to Cloudinary
      try {
        const buffers = files.map((file) => file.buffer);
        imageUrls = await uploadMultipleImagesToCloudinary(buffers, "properties");

        if (imageUrls.length !== buffers.length) {
          throw new Error("Some images failed to upload");
        }
      } catch (uploadErr) {
        await session.abortTransaction();
        console.error("Image upload failed:", uploadErr);
        return res.status(500).json({ message: "Error uploading images" });
      }
    }
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
      images: imageUrls,
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

    if (!properties.length) {
      res.status(404).json({
        success: false,
        message: "No properties found matching your criteria",
      });
      return;
    }

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

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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


export const getMyListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { type, status, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    // Base query: only properties owned by the logged-in Agent
    const baseQuery: FilterQuery<IProperty> = { agent: req.user._id };
    const query: FilterQuery<IProperty> = { ...baseQuery };

  // --- Type & Status filters ---
    const validTypes = ['House', 'Apartment', 'Land', 'Commercial', 'Other'];
    const validStatuses = ['Available', 'Under Contract', 'Sold', 'Rented'];

    if (type) {
      if (!validTypes.includes(type as string)) {
       res.status(400).json({ 
         success: false, 
         message: `Invalid property type: ${type}` 
       });
       return;
     }
     query.type = type;
   }
   if (status) {
     if (!validStatuses.includes(status as string)) {
       res.status(400).json({ 
         success: false, 
         message: `Invalid status: ${status}` 
       });
       return;
     }
     query.status = status;
   }

    // --- Price filter with validation ---
    const min = Number(minPrice);
    const max = Number(maxPrice);

    if ((minPrice && isNaN(min)) || (maxPrice && isNaN(max))) {
      res.status(400).json({
        success: false,
        message: "minPrice and maxPrice must be valid numbers",
      });
      return;
    }

    if ((min < 0) || (max < 0)) {
      res.status(400).json({
        success: false,
        message: "minPrice and maxPrice cannot be negative",
      });
      return;
    }

    if (Number.isFinite(min) || Number.isFinite(max)) {
      if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
        res.status(400).json({ success: false, message: "minPrice cannot exceed maxPrice" });
        return;
      }
      query.price = {};
      if (Number.isFinite(min)) query.price.$gte = min;
      if (Number.isFinite(max)) query.price.$lte = max;
    }

    // --- Sorting logic ---
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price") sortOptions = { price: 1 };
    else if (sort === "-price") sortOptions = { price: -1 };
    else if (sort === "date") sortOptions = { createdAt: -1 };

    // --- Pagination setup ---
    const MAX_PAGE_SIZE = 100;
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Number(limit) || 10, MAX_PAGE_SIZE);
    const skip = (pageNum - 1) * limitNum;

    // --- Total agent listings (before filters) ---
    const agentTotal = await Property.countDocuments(baseQuery);

    if (agentTotal === 0) {
      res.status(404).json({
        success: false,
        message: "You haven’t published any listings yet.",
      });
      return;
    }

    

    const filteredTotal = await Property.countDocuments(query);

    if (filteredTotal === 0) {
      res.status(404).json({
        success: false,
        message: "No listings found matching your search filters.",
      });
      return;
    }

    // --- Fetch filtered listings ---
    const listings = await Property.find(query)
      .populate("agent", "fullName email role")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

      
    if (listings.length === 0) {
      res.status(200).json({
        success: true,
        total: filteredTotal,
        page: pageNum,
        limit: limitNum,
        count: 0,
        data: [],
        message: "You’ve reached the end of your listings.",
      });
      return;
    }

    // ✅ Success response
    res.status(200).json({
      success: true,
      total: filteredTotal,
      page: pageNum,
      limit: limitNum,
      count: listings.length,
      data: listings,
    });

  } catch (error) {
    console.error("Error fetching agent listings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch agent listings. Please try again later.",
    });
  }
};


export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body as IUpdatePropertyRequest;
    const files = req.files as Express.Multer.File[] | undefined;

    // --- Validate ID ---
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid property ID" });
      return;
    }

    // --- Ensure user authenticated ---
    if (!req.user?._id) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    // --- Fetch property ---
    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    // --- Authorization check ---
    const isAdmin = req.user.role === "Admin";
    const isOwner = property.agent.toString() === req.user._id.toString();
    if (!isAdmin && !isOwner) {
      res.status(403).json({ success: false, message: "You’re not allowed to update this property" });
      return;
    }

    // --- Prepare updates safely ---
    const allowedUpdates: (keyof IUpdatePropertyRequest)[] = [
      "title",
      "description",
      "price",
      "location",
      "type",
      "status",
      "bedrooms",
      "bathrooms",
      "squareFootage",
      "isFeatured",
    ];

    const updates: Partial<IUpdatePropertyRequest> = {};
    allowedUpdates.forEach((key) => {
      if (body[key] !== undefined) updates[key] = body[key] as any;
    });

    // --- Validate enums ---
    const validTypes: PropertyType[] = ["House", "Apartment", "Land", "Commercial", "Other"];
    const validStatuses: ListingStatus[] = ["Available", "Under Contract", "Sold", "Rented"];
    if (updates.type && !validTypes.includes(updates.type)) {
      res.status(400).json({ success: false, message: "Invalid property type" });
      return;
    }
    if (updates.status && !validStatuses.includes(updates.status)) {
      res.status(400).json({ success: false, message: "Invalid property status" });
      return;
    }

    // --- Validate and normalize price ---
    if (updates.price !== undefined) {
      const parsedPrice = Number(updates.price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        res.status(400).json({ success: false, message: "Price must be a positive number" });
        return;
      }
      updates.price = parsedPrice;
    }
    
    // --- Validate numeric fields ---
    const ensureNonNegative = (
      value: unknown,
      field: "bedrooms" | "bathrooms" | "squareFootage"
    ): number => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0 || (field === "squareFootage" && parsed <= 0)) {
        throw field;
      }
      return field === "squareFootage" ? parsed : Math.floor(parsed);
    };
    try {
      if (updates.bedrooms !== undefined) {
        updates.bedrooms = ensureNonNegative(updates.bedrooms, "bedrooms");
      }
      if (updates.bathrooms !== undefined) {
        updates.bathrooms = ensureNonNegative(updates.bathrooms, "bathrooms");
      }
      if (updates.squareFootage !== undefined) {
        updates.squareFootage = ensureNonNegative(updates.squareFootage, "squareFootage");
      }
    } catch (field) {
      res.status(400).json({
        success: false,
        message:
          field === "squareFootage"
            ? "Square footage must be a positive number"
            : `${field as string} must be a non-negative number`,
      });
      return;
    }
    // --- Ensure images array exists ---
    property.images = property.images || [];

    // --- Handle new file uploads ---
    if (files && files.length > 0) {
      if (files.length > 10) {
        res.status(400).json({ success: false, message: "You can upload up to 10 images only" });
        return;
      }

      const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
      if (files.some((f) => !validMimeTypes.includes(f.mimetype))) {
        res.status(400).json({ success: false, message: "Invalid file type — only JPG, PNG, WEBP allowed" });
        return;
      }

      try {
        const buffers = files.map((file) => file.buffer);
        const newImageUrls = await uploadMultipleImagesToCloudinary(buffers, "properties");
        property.images!.push(...newImageUrls); // ✅ non-null assertion
        console.log("✅ Uploaded new images:", newImageUrls);
      } catch (uploadErr) {
        console.error("❌ Image upload failed:", uploadErr);
        res.status(500).json({ success: false, message: "Error uploading images" });
        return;
      }
    }

    // --- Handle image removals safely ---
    let removeImages: string[] = [];
    if (body.removeImages) {
      if (typeof body.removeImages === "string") {
        try {
          removeImages = JSON.parse(body.removeImages);
          if (!Array.isArray(removeImages)) removeImages = [];
        } catch {
          removeImages = [];
        }
      } else if (Array.isArray(body.removeImages)) {
        removeImages = body.removeImages;
      }
    }

    if (removeImages.length > 0) {
      const imagesToRemove = removeImages.filter((url) => property.images!.includes(url));
      property.images! = property.images!.filter((img) => !imagesToRemove.includes(img));

      for (const img of imagesToRemove) {
        try {
          await deleteImageFromCloudinary(img);
        } catch (err) {
          console.warn("⚠️ Failed to delete removed image:", img, err);
        }
      }
    }


    // --- Apply other updates ---
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        // @ts-expect-error dynamic assignment is safe
        property[key] = value;
      }
    }

    await property.save();
    const updatedProperty = await Property.findById(id).populate("agent", "fullName email role");

    console.log("✅ Property updated:", updatedProperty);

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ success: false, message: "Failed to update property. Please try again later." });
  }
};
