// src/routes/property.routes.ts
import express from "express";
import { 
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyListings,
  updateProperty

} from "../controllers/property.controller";

import { upload } from "../lib/multer";

import { 
  protectRoutes, 
  authorizeRoutes 
} from "../middlewares/auth.middleware";

const router = express.Router();

// Protected — Only Agent can create
router.post(
  "/createProperty", 
  protectRoutes, 
  authorizeRoutes("Agent"), 
  upload.array("images", 10), // Accept up to 10 images
  createProperty
);

router.get("/myListings", protectRoutes, authorizeRoutes("Agent", "Admin"), getMyListings);
router.put(
  "/updateProperty/:id", 
  protectRoutes, 
  authorizeRoutes("Agent", "Admin"), 
  upload.array("images", 10),
  updateProperty
);
// Public — Get all properties 
router.get("/getProperties", getAllProperties);

// Protected — Get property by ID
router.get("/getProperty/:id", protectRoutes, getPropertyById);


export default router;
