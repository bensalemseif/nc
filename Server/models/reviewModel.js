const mongoose = require("mongoose");
const Product = require("./productModel");
const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    isValid:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// Middleware to remove the review from the product's reviews array
ReviewSchema.pre('findByIdAndDelete', async function (next) {
  try {
    // Find the associated product
    const product = await Product.findById(this.product);

    if (product) {
      // Remove the review ID from the product's reviews array
      product.reviews.pull(this._id);
      await product.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
