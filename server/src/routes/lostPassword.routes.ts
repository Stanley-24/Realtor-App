import express from "express";
import { forgotPassword, resetPassword } from "../controllers/user/forget.psWrd.Controller";
import { forgotPasswordLimiter, resetPasswordLimiter } from "../middlewares/rateLimiterAuth";




const router = express.Router();

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

router.post("/reset-password/:token", resetPasswordLimiter, resetPassword);

export default router;

