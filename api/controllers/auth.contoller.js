import User from "../models/User.js";
import Role from "../models/Role.js";
import UserToken from "../models/UserToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import nodemailer from "nodemailer";

export const register = async (req, res, next) => {
  const role = await Role.findOne({ role: "User" });
  if (!role) {
    return next(CreateError(404, "User not found"));
  }

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
    const { roles } = user || {};
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
    console.log(error);
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

export const sendEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });
  if (!user) {
    return next(CreateError(404, "User not found"));
  }
  const payload = {
    email: user.email,
  };
  const expiryTime = 300;
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiryTime,
  });

  const newToken = new UserToken({
    userId: user.id,
    token: token,
  });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "senthamaraikannanp@gmail.com",
      pass: process.env.PASS,
    },
  });

  let mailDetails = {
    from: "senthamaraikannanp@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `
    <html>
    <head>
      <title>Password Reset Request</title>
    </head>
    <body>
      <h1>Password Reset Request</h1>
      <p>Hello ${user.userName}</p>
      <p>We have received a request to reset your pasword for your account with BookMyBook. To complete the password reset process, Please click on the buton below:</p>
      <a href=${process.env.LIVE_URL}/reset/${token}><button style="background-color:#4CAF50; color:white; padding: 14px 20px; border:none; cursor:pointer; border-radius:4px;">Reset Password</button></a>
      <p>Please note that this link is only valid for a 5 mins. If you did not request a password reset, please disregard this mesage.</p>
      <p>Thank you,</p>
      <p>Building webapp Team</p>
    </body>
    </html>
    `,
  };

  mailTransporter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      console.log(err);
      return next(
        CreateError(500, "Something went wrong while sending the email")
      );
    } else {
      await newToken.save();
      return next(CreateSuccess(200, "Email sent successfully"));
    }
  });
};

export const resetPassword = async (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return next(CreateError(500, "Reset Link is Expired"));
    } else {
      const response = data;
      const user = await User.findOne({
        email: { $regex: "^" + response.email + "$", $options: "i" },
      });
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(newPassword, salt);
      user.password = encryptedPassword;

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: user },
          { new: true }
        );
        return next(CreateSuccess(200, "Password reset successfully !"));
      } catch (error) {
        return next(CreateError(500, "Error while resetting password !"));
      }
    }
  });
};
