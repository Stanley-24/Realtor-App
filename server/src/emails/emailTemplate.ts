import config from "../config/config";

export const generateWelcomeEmail = (fullName: string, role: string) => {
  const CLIENT_URL = config.CLIENT_URL || "http://localhost:5500";
  const ICON_URL = "https://pbs.twimg.com/media/G4RAeTtWAAEmGmE?format=png&name=small"; 

  const greetings = {
    Admin: "Welcome, Mighty Admin 👑",
    Agent: "Welcome, Trusted Agent 🏠",
    Buyer: "Welcome, Smart Buyer 💼",
  };

  const roleMessages = {
    Admin: "You now have full access to manage agents, properties, and users.",
    Agent: "You can start listing properties and connecting with buyers.",
    Buyer: "Browse available listings and connect with trusted agents today.",
  };

  const greeting = greetings[role as keyof typeof greetings] || "Welcome!";
  const message = roleMessages[role as keyof typeof roleMessages] || "";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Realtor App</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
    <div style="max-width: 650px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0078ff, #00b4d8); padding: 30px; text-align: center; color: white;">
        <img src="${ICON_URL}" 
             alt="Realtor App Home Icon" 
             style="width: 80px; height: 80px; border-radius: 50%; background-color: #fff; padding: 10px; margin-bottom: 10px;">
        <h1 style="margin: 10px 0 0; font-size: 26px; font-weight: 600;">${greeting}</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px;">Hi <strong>${fullName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          We’re thrilled to have you join the <strong>Realtor App</strong> as a <strong>${role}</strong>.
          ${message}
        </p>
        <p style="font-size: 15px; line-height: 1.6;">
          Get started by exploring your dashboard and managing your real estate goals today.
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${CLIENT_URL}/login" 
            style="background: linear-gradient(135deg, #0078ff, #00b4d8); color: white; 
            text-decoration: none; padding: 14px 35px; border-radius: 30px; 
            font-size: 16px; font-weight: 500; display: inline-block;">
            Login into your account
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 14px;">Cheers,<br/><strong>The Realtor App Team</strong></p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8f9fa; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} Realtor App. All rights reserved.</p>
        <p style="margin: 5px 0;">Lekki Phase 1, Suite 100, Lagos, Nigeria</p>
      </div>

    </div>
  </body>
  </html>
  `;
};
