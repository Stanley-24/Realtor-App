import mongoose from "mongoose";
import { Request, Response } from "express";
import Property from "../models/property.model";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/**
 * ✅ Create new property (Agent/Admin only)
 * Uses MongoDB transactions to ensure atomicity
 */
export const createProperty = async (req: AuthRequest, res: Response): Promise<Response> => {
  let session: mongoose.ClientSession | null = null;

  try {
    // Start MongoDB session
    session = await mongoose.startSession();
    session.startTransaction();

    // Trim and validate required string fields
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const location = req.body.location?.trim();
    const type = req.body.type?.trim();
    const status = req.body.status?.trim();

    if (!title || !description || !location || !type || !status) {
      return res.status(400).json({ message: "Required fields cannot be empty" });
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
