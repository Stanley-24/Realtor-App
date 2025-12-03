import express from "express";

import { loginWithGoogle, completeGoogleSignup } from "../controllers/google.OAuth.Controller";


const router = express.Router();

// Step 1 — Verify Google Token & Detect Login/Signup
router.post("/google/login", loginWithGoogle);

// Step 2 — Complete Signup (User selects role)
router.post("/google/complete-signup", completeGoogleSignup);

export default router;