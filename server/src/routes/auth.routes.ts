import express from "express";
import { registerUser } from "../controllers/auth.controller"
const router = express.Router();

router.post("/signup", registerUser);

router.get("/login", (req, res) => {
  res.send("Login endpoint");
});

router.get("/logout", (req, res) => {
  res.send("Logout endpoint");
});


export default router;