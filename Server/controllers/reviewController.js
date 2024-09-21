const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// Add a review to a product
exports.addReview = async (req, res) => {
  const {rating, comment } = req.body;
  const { productId } = req.params;
  const userId = req.user.id;

  console.log(req.body)

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ msg: "User has already reviewed this product" });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
    });
    await review.save();

    product.reviews.push(review._id);
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "userName")
      .populate("product", "productName");
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update a review by ID
exports.updateReviewById = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete a review by ID
exports.deleteReviewById = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    res.json({ msg: "Review deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all reviews for a product
exports.getReviewsByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "userName"
    );
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.changeValidation = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $set: { isValid: true } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


