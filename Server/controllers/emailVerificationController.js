// emailVerificationController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendVerificationEmail } = require('../utils/EmailService');

const dotenv = require("dotenv");

dotenv.config();

const EMAIL_JWT_SECRET = process.env.EMAIL_JWT_SECRET

// Send verification email
exports.sendVerificationEmail = async (req, res) => {
    try {
      const { email } = req.query;
      console.log(
        req.query
      )
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      const emailVerificationToken = jwt.sign({ userId: user._id }, EMAIL_JWT_SECRET, { expiresIn: '1h' });
  
      const verificationUrl = `${process.env.CLIENT_BASE_URL}email-validation?email=${email}&token=${emailVerificationToken}`;
      await sendVerificationEmail(email, verificationUrl);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  // Verify email
  exports.verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;
      console.log(token)
      const decoded = jwt.verify(token, EMAIL_JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };