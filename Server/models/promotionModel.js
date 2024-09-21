const mongoose = require("mongoose");
const Product =require('./productModel');

const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discountRate: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    imagePath:{
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);


// Static method to get active promotions
promotionSchema.statics.getActivePromotions = async function () {
  const currentDate = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  });
};

// Static method to get upcoming promotions
promotionSchema.statics.getUpcomingPromotions = async function () {
  const currentDate = new Date();
  return this.find({
    startDate: { $gt: currentDate },
  }).sort({ startDate: 1 }); // Sort by start date ascending
};



// Middleware to remove the review from the product's promotion array
promotionSchema.pre('findByIdAndDelete', async function (next) {
  try {
    // Update all products that have this promotion
    await Product.updateMany(
      { promotion: this._id }, 
      { $set: { promotion: null } }
    );

    next();
  } catch (error) {
    next(error);
  }
});




const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
