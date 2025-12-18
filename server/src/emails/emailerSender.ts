import { sendEmail } from "./emailHandlers";
import { generateWelcomeEmail } from "./emailTemplate";
import { generatePasswordResetEmail} from "./resetPassTemp"
import { EmailResult } from "../types/email.types";
import { generateContactReceivedEmail, generateContactAdminNotification } from "./contactEmailTemplate";
import config from "../config/config";

export async function sendWelcomeEmail(newUser: any, res: any) {

  // Send welcome email (non-blocking - don't fail signup if email fails)
  try {
    const html = generateWelcomeEmail(newUser.fullName, newUser.role);
    await sendEmail({
      to: newUser.email,
      subject: `Welcome to Rental Wave, ${newUser.fullName}!`,
      html,
    });
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
    // Continue with signup completion despite email failure
  }
}





export const sendPasswordResetEmailService = async (
  email: string,
  fullName: string,
  resetUrl: string
): Promise<EmailResult>  => {
  try {
    const html = generatePasswordResetEmail(fullName, resetUrl);

    const result = await sendEmail({
      to: email,
      subject: "Reset Your Rental Wave Password",
      html,
    });

    return result; // { success: true, data } or { success: false, error }
  } catch (emailError) {
    console.error("Failed to send password reset email:", emailError);
    return { success: false, error: emailError };
  }
};




export async function sendContactConfirmationEmail(fullName: string, email: string) {
  try {
    const html = generateContactReceivedEmail(fullName);
    await sendEmail({
      to: email,
      subject: "We've Received Your Message – Rental Wave",
      html,
    });
  } catch (error) {
    console.error("Failed to send contact confirmation email:", error);
  }
}

export async function sendContactNotificationToAdmin(fullName: string, email: string, message: string) {
  try {
    const html = generateContactAdminNotification(fullName, email, message);
    const ADMIN_EMAIL = config.ADMIN_EMAIL || "admin@rentalwave.com"; 

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New support ticket opened by ${fullName}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}