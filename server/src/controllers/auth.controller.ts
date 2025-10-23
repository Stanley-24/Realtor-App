import { Request, Response } from "express";
import User from "../models/user.model";
import { IUserRegisterBody } from "../types/User.types";
import bcrypt from "bcryptjs";
import { generateToken, getDashboardUrl } from "../lib/utils";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, role, profilePicture }: IUserRegisterBody = req.body;
    const normalizedEmail = email.toLowerCase();


    if (!fullName || !email || !password) {
      res.status(400).json({ message: "Please fill in all required fields" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters" });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }


    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password,
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





export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // --- Validation Checks ---
    if (!email || !password) {
      res.status(400).json({ message: "Please provide both email and password" });
      return;
    }
    
    // 1. Find user by email and explicitly select the password field
  
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');


    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // 2. Compare the plain text password with the hashed password from the database
   
    const isMatch = await bcrypt.compare(password, user.password!); 

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    
    // 3. Authentication successful: Generate token
    generateToken(String(user._id), user.role, res);
    
    // 4. Send successful login response (exclude password)
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      redirectUrl: getDashboardUrl(user.role as string), 
    });

  } catch (error) {
    console.error("Login error controller:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
