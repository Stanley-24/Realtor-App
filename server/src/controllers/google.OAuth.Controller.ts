import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import { generateToken } from "../lib/utils";
import { getDashboardUrl } from "../lib/utils";
import config from "../config/config";
import { generateWelcomeEmail } from "../emails/emailTemplate";
import { sendEmail } from "../emails/emailHandlers";



const client = new OAuth2Client(config.googleClientId);


export const loginWithGoogle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: "Google ID Token is required" });
      return;
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(400).json({ message: "Invalid Google token" });
      return;
    }

    const { email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });

    // --------------------------------
    // Case A: Existing User → Login
    // --------------------------------

    if (user) {
      const token = generateToken(String(user._id), user.role, res);

      res.status(200).json({
        status: "EXISTING_USER",
        message: "Login successful",
        token, // Return token in response for client-side storage
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
        redirectUrl: getDashboardUrl(user.role),
      });
      return;
    }

    // --------------------------------
    // Case B: New User → Need Role
    // --------------------------------

    res.status(200).json({
      status: "NEW_USER",
      message: "Role required",
      fullName: name,
      email: normalizedEmail,
      profilePicture: picture || "",
      needsRole: true,
      redirectUrl: "/select-role", 
    });

  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ message: "Server error during Google authentication" });
  }
};




export const completeGoogleSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, role } = req.body;

    if (!idToken || !role) {
      res.status(400).json({ message: "ID Token and role are required" });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(400).json({ message: "Invalid Google token" });
      return;
    }

    const { email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase();

    // Prevent duplicate registration
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(400).json({ message: "User already exists, please login instead." });
      return;
    }

    // Normalize role to match enum: 'Agent', 'Buyer', 'Admin'
    const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    if (!['Agent', 'Buyer', 'Admin'].includes(normalizedRole)) {
      res.status(400).json({ message: "Invalid role. Must be 'Agent', 'Buyer', or 'Admin'" });
      return;
    }

    // Create new user with chosen role
    const newUser = await User.create({
      fullName: name,
      email: normalizedEmail,
      password: null, // OAuth user has no password
      role: normalizedRole,
      profilePicture: picture || "",
      authProvider: "google",
    });

    // Generate JWT
    const token = generateToken(String(newUser._id), newUser.role, res);

    const html = generateWelcomeEmail(newUser.fullName, newUser.role);
      await sendEmail({
        to: newUser.email,
        subject: `Welcome to Realtor App, ${newUser.fullName}!`,
        html,
      });

    res.status(201).json({
      status: "SIGNUP_COMPLETE",
      message: "Signup completed",
      token, // Return token in response for client-side storage
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      },
      redirectUrl: getDashboardUrl(newUser.role),
    });

  } catch (error) {
    console.error("Google Signup Completion Error:", error);
    res.status(500).json({ message: "Server error during Google signup completion" });
  }
};