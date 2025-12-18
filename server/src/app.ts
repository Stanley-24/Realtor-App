import express from "express";
import cors from "cors";
import config from "./config/config";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import healthRoutes from "./routes/health.checker"
import googleAuthRoutes from "./routes/googleAuth.routes";
import lostPasswordRoutes from "./routes/lostPassword.routes";
import contactRoutes from "./routes/contactForm.routes";

import path from "path";
import cookieParser from "cookie-parser";

const app = express();


app.set('trust proxy', 1);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow cookies to be sent/received
  })
);

// Set Cross-Origin-Opener-Policy header to allow Google OAuth postMessage
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// 🔧 Middleware
app.use(express.json());
app.use(cookieParser());

// health checker
app.use("/api/v1", healthRoutes);

app.use("/api/v1/auth", googleAuthRoutes);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/auth", lostPasswordRoutes);
app.use("/api/v1", contactRoutes);



if (config.nodeEnv === "production") {
  const clientPath = path.join(__dirname, "../../client/dist");

  app.use(express.static(clientPath));

  app.get("*", (_, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

export default app;
