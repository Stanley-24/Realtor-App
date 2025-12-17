import config from "../config/config";

export const generateWelcomeEmail = (fullName: string, role: string) => {

  const APP_NAME = config.NAME || "Rental Wave";
  const ICON_URL = config.ICON_URL || "https://pbs.twimg.com/media/G8TuzLlWcAArhIK?format=png&name=small";
  const VITE_CLIENT_URL = config.VITE_CLIENT_URL || "https://realtor-app-mcoo.onrender.com";


  const roleMessages = {
    Admin: "You now have full access to manage agents, properties, and users.",
    Agent: "You can start listing properties and connecting with buyers.",
    Buyer: "Browse available listings and connect with trusted agents today.",
  };
 
  const message = roleMessages[role as keyof typeof roleMessages] || "";

  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to ${APP_NAME}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
        <div style="max-width: 650px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
        <!-- Header -->
          <div style="background: linear-gradient(135deg, #ba3fc0, #bbb7bb); padding: 3px; text-align: center; max-width: 100%; display: inline-block;">
            <img 
              src="${ICON_URL}" 
              alt="Rental Wave Logo" 
              style="width: 100%; max-width: 647px; height: auto; display: block; margin: 0 auto;">
          </div>


          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hi <strong>${fullName}</strong>,</p>
            
            <p style="font-size: 15px; line-height: 1.6;">
              We’re so excited to see you join us at <strong>${APP_NAME}</strong> as a <strong>${role}</strong>.<br/>
              ${message}
            </p>
            
            <p style="font-size: 15px; line-height: 1.6;">
              Get started by exploring your dashboard to see the wonderful stuff we have for you
            </p>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${VITE_CLIENT_URL}/login" 
                style="background: #ba3fc0; 
                        color: white; 
                        text-decoration: none; 
                        padding: 16px 20px; 
                        border-radius: 30px; 
                        font-size: 17px; 
                        font-weight: 500; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(186, 63, 192, 0.3);">
                Login Your Account
              </a>
            </div>

            <p style="margin-top: 30px; font-size: 14px;">
              Cheers,<br/>
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
