const Promotion = require("../models/promotionModel");
const Product = require("../models/productModel");

// Create a new promotion
exports.createPromotion = async (req, res) => {
  const { name, discountRate, startDate, endDate, isActive } = req.body;

  try {
    const newPromotion = new Promotion({
      name,
      discountRate,
      startDate,
      endDate,
      isActive,
    });

    await newPromotion.save();
    res.status(201).json(newPromotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all promotions
exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate("products");
    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single promotion
exports.getPromotionById = async (req, res) => {
  const { id } = req.params;

  try {
    const promotion = await Promotion.findById(id).populate("products");

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a promotion
exports.updatePromotion = async (req, res) => {
  const { id } = req.params;
  const { name, discountRate, startDate, endDate, isActive } = req.body;

  try {
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      id,
      { name, discountRate, startDate, endDate, isActive },
      { new: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json(updatedPromotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a promotion
exports.deletePromotion = async (req, res) => {
  const { id } = req.params;

  try {
    await Promotion.findByIdAndDelete(id);
    // Optionally, remove promotion references from products
    await Product.updateMany({ promotion: id }, { $unset: { promotion: "" } });

    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign promotion to products
exports.assignPromotionToProducts = async (req, res) => {
  const { id } = req.params; // Promotion ID
  const { productId } = req.body; // Array of product IDs
  console.log(productId)
  console.log(id)

  try {
    await Promotion.findByIdAndUpdate(id, { $push: { products: productId } });
    await Product.updateMany(
      { _id: { $in: productId } },
      { $set: { promotion: id } }
    );

    res.status(200).json({ message: "Promotion assigned to products successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove promotion from products
exports.removePromotionFromProducts = async (req, res) => {
  const { id } = req.params; // Promotion ID
  const { productId } = req.body; // Array of product IDs

  try {
    await Promotion.findByIdAndUpdate(id, { $pull: { products: productId } });
    await Product.updateMany(
      { _id: { $in: productId }, promotion: id },
      { $unset: { promotion: "" } }
    );

    res.status(200).json({ message: "Promotion removed from products successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET /api/promotions/active
exports.getActivePromotions = async (req, res) => {
  try {
    const activePromotions = await Promotion.getActivePromotions();
    res.status(200).json({
      success: true,
      data: activePromotions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active promotions',
      error: error.message,
    });
  }
};

// GET /api/promotions/upcoming
exports.getUpcomingPromotions = async (req, res) => {
  try {
    const upcomingPromotions = await Promotion.getUpcomingPromotions();
    res.status(200).json({
      success: true,
      data: upcomingPromotions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming promotions',
      error: error.message,
    });
  }
};
