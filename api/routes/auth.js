import express from "express";
import {
  register,
  login,
  registerAdmin,
  sendEmail,
  resetPassword,
} from "../controllers/auth.contoller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/register-admin", registerAdmin);

router.post("/send-email", sendEmail);

router.post("/reset-password", resetPassword);

export default router;
