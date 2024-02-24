import express from "express";
import {
  register,
  login,
  registerAdmin,
} from "../controllers/auth.contoller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/register-admin", registerAdmin);

export default router;
