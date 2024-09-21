const User = require("../models/userModel");

exports.getUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add product to wishlist by user ID

exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove product from wishlist by user ID

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;
    user.wishlist.pull(productId);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
