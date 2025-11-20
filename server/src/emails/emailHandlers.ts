import {resend, EmailOptions} from "../lib/resend";
import config from "../config/config";
 

/**
 * Sends an email using Resend API
 */
export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${config.NAME} <${config.EMAIL_FROM}>`,
      to: to || (config.EMAIL_TO as string),
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };

  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err };
  }
};
