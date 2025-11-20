import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser} from "../controllers/auth.controller"
import { protectRoutes } from "../middlewares/auth.middleware";


const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/me", protectRoutes, getCurrentUser);

router.post("/logout", protectRoutes, logoutUser);


export default router;