import mongoose from "mongoose";
import { Request, Response } from "express";
import Property from "../models/property.model";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

/**
 * ✅ Create new property (Agent/Admin only)
 * Uses MongoDB transactions to ensure atomicity
 */
export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const session = await mongoose.startSession();

  try {
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
      res
        .status(400)
        .json({ message: "Title, description, price, and location are required" });
      return;
    }

    // Ensure authenticated user
    if (!req.user?._id) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Start MongoDB transaction
    session.startTransaction();

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

    res.status(201).json({
      message: "Property created successfully",
      property: property[0],
    });
  } catch (error) {
    console.error("Create property transaction error:", error);

    // Rollback changes if anything fails
    await session.abortTransaction();

    res.status(500).json({ message: "Server error creating property" });
  } finally {
    // Clean up the session
    session.endSession();
  }
};
