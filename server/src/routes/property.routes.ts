// src/routes/property.routes.ts
import express from "express";
import { 
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyListings

} from "../controllers/property.controller";

import { 
  protectRoutes, 
  authorizeRoutes 
} from "../middlewares/auth.middleware";

const router = express.Router();

// Protected — Only Agent can create
router.post("/createProperty", protectRoutes, authorizeRoutes("Agent"), createProperty);

router.get("/myListings", protectRoutes, authorizeRoutes("Agent", "Admin"), getMyListings);
// Public — Get all properties 
router.get("/getProperties", getAllProperties);

// Protected — Get property by ID
router.get("/getProperty/:id", protectRoutes, getPropertyById);


export default router;
