import { Request, Response } from "express";
import User from "../models/user.model";
import { IUserRegisterBody } from "../types/User.types";
import bcrypt from "bcryptjs";
import { generateToken, getDashboardUrl } from "../lib/utils";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, role, profilePicture }: IUserRegisterBody = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ message: "Please fill in all required fields" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "Buyer",
      profilePicture: profilePicture || "",
    });

    generateToken(String(newUser._id), newUser.role, res);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      },
      redirectUrl: getDashboardUrl(newUser.role), // 👈 important for frontend
    });
  } catch (error) {
    console.error("Signup error controller:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};
