import { Router } from "express";
import { submitContactForm } from "../controllers/user/contactForm.controller";

const router = Router();

router.post("/contact", submitContactForm);

export default router;