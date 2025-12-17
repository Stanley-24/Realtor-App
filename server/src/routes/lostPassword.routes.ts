import express from "express";
import { forgotPassword, resetPassword } from "../controllers/user/forget.psWrd.Controller";




const router = express.Router();

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;

