import express from "express";
import {
  createRole,
  deleteRole,
  getRole,
  updateRole,
} from "../controllers/role.controller.js";

const router = express.Router();

//create a new role in DB
router.post("/create", createRole);

//update role in DB
router.put("/update/:id", updateRole);

//get role from DB
router.get("/getAll", getRole);

//delete role from DB
router.delete("/deleteRole/:id", deleteRole);
export default router;
