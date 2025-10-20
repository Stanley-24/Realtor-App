import express from "express";
import cors from "cors";
import config from "./config/config";
import authRoutes from "./routes/auth.routes.ts";


const app = express();

// 🔧 Middleware
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Realtor App API");
});

// 🌍 Port setup
const PORT = config.port

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`⚡️ Server running on http://localhost:${PORT}`);
});
