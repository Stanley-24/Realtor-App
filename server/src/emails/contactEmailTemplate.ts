import config from '../config/config';

const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  };


export const generateContactReceivedEmail = (fullName: string) => {
  const APP_NAME = config.NAME || "Rental Wave";
  const ICON_URL = config.ICON_URL || "https://pbs.twimg.com/media/G8TuzLlWcAArhIK?format=png&name=small";
  const VITE_CLIENT_URL = config.VITE_CLIENT_URL || "https://realtor-app-mcoo.onrender.com";

  
  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Thank You for Contacting Us - ${APP_NAME}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
        <div style="max-width: 650px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ba3fc0, #bbb7bb); padding: 3px; text-align: center;">
            <img src="${ICON_URL}" alt="${APP_NAME} Logo" style="width: 100%; max-width: 647px; height: auto; display: block; margin: 0 auto;">
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 18px; font-weight: bold;">Hi ${escapeHtml(fullName)},</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to <strong>${APP_NAME}</strong>! We've received your message and appreciate you taking the time to contact us.
            </p>
            
            <p style="font-size: 15px; line-height: 1.6;">
              Our team will review your inquiry and get back to you as soon as possible — usually within 24–48 hours.
            </p>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="font-size: 14px; color: #555; margin: 0;">
                <strong>We'll reply to:</strong> your email<br/>
            
              </p>
            </div>

            <p style="font-size: 15px; line-height: 1.6;">
              In the meantime, feel free to explore more properties or contact us again if needed.
            </p>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${VITE_CLIENT_URL}" 
                style="background: #ba3fc0; 
                        color: white; 
                        text-decoration: none; 
                        padding: 16px 32px; 
                        border-radius: 30px; 
                        font-size: 17px; 
                        font-weight: 500; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(186, 63, 192, 0.3);">
                Visit ${APP_NAME}
              </a>
            </div>

            <p style="margin-top: 30px; font-size: 14px;">
              Best regards,<br/>
              <strong>The ${APP_NAME} Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; text-align: center; padding: 20px; font-size: 12px; color: #777;">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            <p style="margin: 5px 0;">Lekki Phase 1, Suite 100, Lagos, Nigeria</p>
            <p style="margin: 10px 0 0;">
              <a href="${VITE_CLIENT_URL}" style="color: #0078ff; text-decoration: none;">Visit our website</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const generateContactAdminNotification = (fullName: string, email: string, message: string) => {
  const APP_NAME = config.NAME || "Rental Wave";

  return `
    <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>New Contact Form Submission - ${APP_NAME}</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
          <h2>Contact form Ticket</h2>
          <p><strong>Ticket sender:</strong> ${escapeHtml(fullName)} (${escapeHtml(email)})</p>
          <p><strong>Message Details:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ba3fc0; margin: 20px 0;">
            ${escapeHtml(message).replace(/\n/g, '<br/>')}
          </div>
          <p><em>This Ticket was submitted via the contact form on ${APP_NAME} website.</em></p>
        </div>
      </body>
    </html>
  `;
};