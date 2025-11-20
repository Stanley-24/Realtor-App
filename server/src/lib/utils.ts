import jwt from "jsonwebtoken";
import { Response } from "express";
import config from "../config/config";

export const generateToken = (userId: string, role: string, res: Response): string => {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  if (!userId?.trim()) {
    throw new Error("userId is required");
  }

  if (!role?.trim()) {
    throw new Error("role is required");
  }

  // Sign token
  const token = jwt.sign({ userId, role }, config.JWT_SECRET, { expiresIn: "7d" });

  // Set cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: config.nodeEnv !== "development",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

/**
 * Helper: Return dashboard URL for each role.
 */
export const getDashboardUrl = (role: string): string => {
  if (!role?.trim()) {
    throw new Error("role is required");
  }
  
  switch (role.toLowerCase()) {
    case "admin":
      return "/dashboard/admin";
    case "agent":
      return "/dashboard/agent";
    case "buyer":
      return "/dashboard/buyer";
    default:
      throw new Error(`Unknown role: ${role}`);
  }
};
