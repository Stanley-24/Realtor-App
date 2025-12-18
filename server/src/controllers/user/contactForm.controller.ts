import { Request, Response } from "express";
import ContactMessage from "../../models/contactMessage.model";
import { IContactFormBody } from "../../types/contact.types";
import { sendContactConfirmationEmail, sendContactNotificationToAdmin } from "../../emails/emailerSender";

export const submitContactForm = async (req: Request<{}, {}, IContactFormBody>, res: Response): Promise<void> => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      res.status(400).json({ message: "Please fill in all fields" });
      return;
    }

    if (message.length < 10) {
      res.status(400).json({ message: "Message must be at least 10 characters" });
      return;
    }

    if (message.length >= 5001) {
      res.status(400).json({ message: "Message must be less than 5000 characters" });
      return;
    }

    // Save to database
    const contactMessage = await ContactMessage.create({
      fullName,
      email,
      message,
    });

    // Send confirmation to user (non-blocking)
    sendContactConfirmationEmail(fullName, email);

    // Notify admin (non-blocking)
    sendContactNotificationToAdmin(fullName, email, message);

    res.status(201).json({
      message: "Thank you! Your message has been sent successfully.",
      data: contactMessage,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};