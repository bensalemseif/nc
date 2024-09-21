const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

exports.loginCheck = async (req, res, next) => {
  // Get the token from request headers
  let token = req.headers.authorization;
  // Check if token is present

  if (token && token.startsWith("Bearer ")) {

    // Remove "Bearer " prefix from token
    token = token.slice(7, token.length).trimLeft();
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token is present
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from database based on token payload
    const reqUser = await User.findById(decoded.user.id);

    // Check if user exists
    if (!reqUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!reqUser.isVerified) {
      return res.status(401).json({ msg: "User is not verified" });
    }
    if (reqUser.isDeleted) {
      return res.status(404).json({ msg: "User is Deleted" });
    }
    // Attach user information to the request object
    req.user = {
      id: reqUser._id,
      userName: reqUser.userName,
      role: reqUser.role, // Attach role to req.user for further use
    };

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
