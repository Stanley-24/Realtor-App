import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import config from "../config/config";
import { IUser } from "../types/User.types";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protectRoutes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // --- 1️⃣ Check Authorization header (case-insensitive) ---
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[1].trim() !== "") {
      token = parts[1].trim();
    } else {
      return res.status(401).json({ message: "Invalid authorization header format" });
    }
  }

  // --- 2️⃣ If no header token, check cookie ---
  if (!token && req.cookies?.token) {
    token = req.cookies.token.trim();
  }

  // --- 3️⃣ Reject if still no token ---
  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// --- Role-based authorization ---
export const authorizeRoutes =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient role" });
    }

    next();
  };
