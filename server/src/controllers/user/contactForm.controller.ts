import { Request, Response } from "express";
import ContactMessage from "../../models/contactMessage.model";
import { IContactFormBody } from "../../types/contact.types";
import { sendContactConfirmationEmail, sendContactNotificationToAdmin } from "../../emails/emailerSender";

export const submitContactForm = async (req: Request<{}, {}, IContactFormBody>, res: Response): Promise<void> => {
  try {
    let { fullName, email, message } = req.body;

    fullName = fullName?.trim();
    email = email?.trim().toLowerCase();
    message = message?.trim();

    if (!fullName || !email || !message) {
      res.status(400).json({ message: "Please fill in all fields" });
      return;
    }

    if (message.length < 10) {
      res.status(400).json({ message: "Message must be at least 10 characters" });
      return;
    }

    if (message.length >= 276) {
      res.status(400).json({ message: "Message must be less than 275 characters or use the email for long messages" });
      return;
    }

    // Save to database
    const contactMessage = new ContactMessage({
      fullName,
      email,
      message,
    });

    await contactMessage.save();

    // Send confirmation to user (non-blocking)
    sendContactConfirmationEmail(fullName, email);

    // Notify admin (non-blocking)
    sendContactNotificationToAdmin(fullName, email, message);

    res.status(201).json({
      message: "Thank you! Your message has been sent successfully.",
      data: contactMessage,
    });
  } 
  catch (error: any) {
    console.error("Contact form submission error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.errors) {
      console.error("Validation errors:", Object.values(error.errors).map((e: any) => e.message));
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message).join("; ");
      res.status(400).json({ message: messages || "Invalid data provided" });
      return;
    }

    res.status(500).json({ message: "Server error. Please try again later." });
  }
};