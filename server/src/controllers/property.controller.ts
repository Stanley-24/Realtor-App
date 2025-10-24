import { Response } from "express";
import Property from "../models/property.model";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// ✅ Create new property (Agent/Admin only)
export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
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
      res.status(400).json({ message: "Title, description, price, and location are required" });
      return;
    }

    // Ensure authenticated user
    if (!req.user?._id) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Create property linked to the logged-in agent
    const property = await Property.create({
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
    });

    // Add property reference to agent’s listings
    await User.findByIdAndUpdate(req.user._id, {
      $push: { listings: property._id },
    });

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Server error creating property" });
  }
};
