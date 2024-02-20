import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
  const role = await Role.find({ role: "user" });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
    roles: [role._id],
  });
  await newUser.save();
  return res.status(200).send("User created successfully");
};
