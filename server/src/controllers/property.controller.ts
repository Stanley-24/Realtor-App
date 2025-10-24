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

    const {
      title,
      description,
      price,
      location,
      bedrooms,
      bathrooms,
      squareFootage,
      type,
      status,
      images,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !location) {
      return res
        .status(400)
        .json({ message: "Title, description, price, and location are required" });
    }

    // Ensure authenticated user
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create property document inside transaction
    const property = await Property.create(
      [
        {
          title,
          description,
          price,
          location,
          bedrooms,
          bathrooms,
          squareFootage,
          type,
          status,
          images,
          isFeatured,
          agent: req.user._id,
        },
      ],
      { session }
    );

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
