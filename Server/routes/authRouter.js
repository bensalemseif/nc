  const express = require("express");
  const router = express.Router();
  const {
    verifyEmail,
    sendVerificationEmail,
  } = require("../controllers/emailVerificationController");
  const { loginCheck } = require("../middlewares/authMiddleware");
  const { register, login , forgotPassword, resetPassword, logout } = require("../controllers/authController");

  // logins
  router.post("/register", register);
  router.post("/login", login);
  //logout
  router.post("/logout", logout);

  // Password reset routes
  //otp EMAIL
  router.post("/forgot-password", forgotPassword);
  //reset
  router.post("/reset-password", resetPassword);

  // Email verification routes
  router.get("/verify-email", verifyEmail);
  router.post("/resend-verification-email", sendVerificationEmail);

  module.exports = router;
