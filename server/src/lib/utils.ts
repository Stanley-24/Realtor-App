import jwt from "jsonwebtoken";
import config from "../config/config";
import { Response } from "express";

/**
 * Generate JWT token and set it as an HTTP-only cookie.
 */
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

  const token = jwt.sign({ userId, role }, config.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: config.nodeEnv !== "development",
  });

  return token;
};

/**
 * Helper: Return dashboard URL for each role.
 */
export const getDashboardUrl = (role: string): string => {
  switch (role) {
    case "Admin":
      return "/dashboard/admin";
    case "Agent":
      return "/dashboard/agent";
    default:
      return "/dashboard/buyer";
  }
};
