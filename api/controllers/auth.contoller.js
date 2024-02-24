import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

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
    roles: role,
  });
  await newUser.save();
  return res.status(200).json("User Registered Successfully");
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "roles",
      "role"
    );
    const { roles } = user;
    if (!user) {
      return next(CreateError(404, "User not found"));
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(CreateError(400, "Password incorrect"));
    }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, roles: roles },
      process.env.JWT_SECRET
    );
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ status: 200, message: "Login success", data: user });
  } catch (error) {
    return next(CreateError(500, "Something went wrong"));
  }
};

export const registerAdmin = async (req, res, next) => {
  const role = await Role.find({});
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: true,
    roles: role,
  });
  await newUser.save();
  return next(CreateSuccess(200, "Admin created successfully"));
};
