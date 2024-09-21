  const mongoose = require("mongoose");
  const Order = require("./orderModel"); 

  const productSchema = new mongoose.Schema(
    {
      productName: {
        type: String,
        required: true,
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      realStock: {
        type: Number,
        required: true,
      },
      imagePath: [{ type: String, default: [] }],
      description: String,
      price: {
        type: Number,
        required: false,
      },
      includingGift: {
        type: Boolean,
        default: true,
      },
      giftPoints: {
        type: Number,
        default: 0,
      },
      size:{
        type: String,
        required: false,
      },
      video:{
        type: String,
        default: null,
      },
      Ingredients :[
          {
            type: String,
            required: true,
          },
        ],
      reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
      promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion",
      },
      gifts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gift",
        }
      ],
      isDisabled:{
        type: Boolean,
        default: false,
      }
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  productSchema.virtual("AVGrating").get(function () {
    if (this.reviews.length === 0) {
      return 0;
    }
    const totalRating = this.reviews.reduce(
      (acc, review) => acc + (review.rating || 0),
      0
    );
    return totalRating / this.reviews.length;
  });

  productSchema.virtual("finalPrice").get(function () {
    if (
      this.promotion && 
      this.promotion.isActive &&
      this.promotion.startDate <= new Date() &&
      this.promotion.endDate >= new Date()
    ) {
      return this.price - this.price * (this.promotion.discountRate / 100);
    }
    return this.price;
  });


  productSchema.pre("findByIdAndDelete", async function (next) {
    try {
      // Remove this product from the products list in all orders
      await Order.deleteMany(
        { "products.product": this._id });
      next();
    } catch (error) {
      next(error);
    }
    });

  const Product = mongoose.model("Product", productSchema);

  module.exports = Product;
