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

  // --- 1️⃣ Check Authorization header ---
  const authHeader = req.headers.authorization;
  if (authHeader) {
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization header format" });
    }

    const tokenPart = authHeader.split(" ")[1];
    if (!tokenPart || !tokenPart.trim()) {
      return res.status(401).json({ message: "Invalid authorization header format" });
    }

    token = tokenPart.trim();
  }

  // --- 2️⃣ If no header token, check cookie ---
  if (!token && req.cookies?.jwt) {
    const cookieToken = req.cookies.jwt.trim();
    if (cookieToken) {
      token = cookieToken;
    }
  }

  // --- 3️⃣ Reject if still no token ---
  // Ensure token is a non-empty string
  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }
  
  // Final trim to ensure clean token
  token = token.trim();
  
  // Reject if token is empty after trimming
  if (token.length === 0) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Decode JWT
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Attach user object to request (excluding password)
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found or token invalid" });
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
