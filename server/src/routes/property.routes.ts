// src/routes/property.routes.ts
import express from "express";
import { createProperty } from "../controllers/property.controller";
import { protectRoutes, authorizeRoutes } from "../middlewares/auth.middleware";

const router = express.Router();

// Protected — Only Agent or Admin can create
router.post("/createProperty", protectRoutes, authorizeRoutes("Agent", "Admin"), createProperty);

export default router;
