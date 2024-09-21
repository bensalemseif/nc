const express = require("express");
const router = express.Router();
const {
  getUserById,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserById,
  toggleUserStatusById
} = require("../controllers/userController");
const { loginCheck, isAdmin } = require("../middlewares/authMiddleware");

// User profile routes
router.get("/profile", loginCheck, getUserProfile);
router.put("/profile", loginCheck, updateUserProfile);
router.put("/password", loginCheck, changePassword);

//admin routes
router.get("/", loginCheck, isAdmin, getAllUsers);
router.get("/:id", loginCheck, isAdmin, getUserById);

router.delete("/:id", loginCheck, isAdmin, deleteUserById);
router.put("/disable/:id", loginCheck, isAdmin, toggleUserStatusById);
module.exports = router;
