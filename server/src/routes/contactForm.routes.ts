import { Router } from "express";
import { submitContactForm } from "../controllers/user/contactForm.controller";
import { contactFormLimiter } from "../middlewares/rateLimiterContact";

const router = Router();

router.post("/contact", contactFormLimiter, submitContactForm);

export default router;