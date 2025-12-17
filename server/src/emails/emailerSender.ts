import { sendEmail } from "./emailHandlers";
import { generateWelcomeEmail } from "./emailTemplate";
import { generatePasswordResetEmail} from "./resetPassTemp"
import { EmailResult } from "../types/email.types";

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