import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller"


const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/logout", (req, res) => {
  res.send("Logout endpoint");
});


export default router;