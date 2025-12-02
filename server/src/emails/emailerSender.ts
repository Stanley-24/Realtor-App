import { sendEmail } from "./emailHandlers";
import { generateWelcomeEmail } from "./emailTemplate";

export async function sendWelcomeEmail(newUser: any, res: any) {

  // Send welcome email (non-blocking - don't fail signup if email fails)
  try {
    const html = generateWelcomeEmail(newUser.fullName, newUser.role);
    await sendEmail({
      to: newUser.email,
      subject: `Welcome to Realtor App, ${newUser.fullName}!`,
      html,
    });
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
    // Continue with signup completion despite email failure
  }
}