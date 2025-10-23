import express from "express";
import cors from "cors";
import config from "./config/config";
import authRoutes from "./routes/auth.routes";
import path from "path";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";

const app = express();






// 🔧 Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);



if (config.nodeEnv === "production") {
  const clientPath = path.join(__dirname, "../../client/dist");

  app.use(express.static(clientPath));

  app.get("*", (_, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}



// 🌍 Port setup
const PORT = config.port;

// 🚀 Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`⚡️ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
