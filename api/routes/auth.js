import express from "express";
import {
  register,
  login,
  registerAdmin,
  sendEmail,
} from "../controllers/auth.contoller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/register-admin", registerAdmin);

router.post("/send-email", sendEmail);

export default router;
