const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");
const { sendVerificationEmail } = require("../controllers/emailVerificationController");
const { sendOtpEmail } = require('../utils/EmailService');
const Cart = require("../models/cartModel");
const { query } = require("express");

dotenv.config();

const TOKEN_EXPIRY = "7d";  // Token validity
const COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000;  // Cookie expiry (7 days)

// Register user
exports.register = async (req, res) => {
  const { userName, email, phoneNumber, password, profile, address } = req.body;

  try {
    let user = await User.findOne({ $or: [{ userName }, { email }, { phoneNumber }] });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    profile.imagePath =`https://avatar.iran.liara.run/username?username=${profile.firstName}+${profile.lastName}`;

    user = await User.create({ userName, email, phoneNumber, password, profile, address });

    // Send verification email
    await sendVerificationEmail({ query: { email } }, res);
    await Cart.create({ user: user._id, items: [] });

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Login user and save token in cookies
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(401).json({ msg: "User is blocked" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ msg: "User is not verified" });
    }

    user.password = undefined;  // Hide the password

    // Create JWT token
    const payload = {
      user: { id: user.id, userName: user.userName, role: user.role },
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,  // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production",  // Ensure HTTPS in production
      sameSite: "Strict",  // Prevent cross-site request forgery
      maxAge: COOKIE_EXPIRY,  // Cookie expires in 7 days
    });

    return res.status(200).json({ token, user, message: "Login successful" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

// Logout user (clear token from cookies)
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: "",
  });

  return res.status(200).json({ message: "Logout successful" });
};

// Forgot password (send OTP via email)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000);
    user.otpCode = otpCode;
    user.otpCodeExpires = new Date(Date.now() + 1800000); // OTP expires in 30 minutes
    await user.save();

    // Send OTP email
    await sendOtpEmail(user.email, otpCode);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

// Reset password with OTP
exports.resetPassword = async (req, res) => {
  console.log(req )

  const { otp, newPassword ,email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Validate OTP and its expiration
    if (!user.otpCode || user.otpCode != otp || Date.now() > user.otpCodeExpires) {
      return res.status(400).send("Invalid or expired OTP");
    }

    // Update password
    user.password = newPassword;
    user.otpCode = undefined;
    user.otpCodeExpires = undefined;
    await user.save();

    return res.status(200).send("Password reset successfully");
  } catch (err) {
    return res.status(500).send("Server Error");
  }
};
