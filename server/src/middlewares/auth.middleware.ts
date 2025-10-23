import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const protectRoutes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // check Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based authorization
export const authorizeRoutes =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access forbidden: insufficient role" });
      return;
    }

    next();
  };
