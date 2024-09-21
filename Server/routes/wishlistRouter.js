const express = require("express");
const router = express.Router();
const User = require('./../models/userModel')
const {
  removeFromWishlist,
  addToWishlist,
  getUserWishlist
} = require("../controllers/wishlistController");
const { loginCheck } = require("../middlewares/authMiddleware");

// Wishlist routes

router.post("/add/:productId", loginCheck, addToWishlist);
router.delete("/remove/:productId", loginCheck, removeFromWishlist);
// Example endpoint to check if a product is in the wishlist
router.get("/check/:productId", loginCheck, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isInWishlist = user.wishlist.some(product => product._id.toString() === req.params.productId);
    res.json({ isInWishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", loginCheck, getUserWishlist);


module.exports = router;
