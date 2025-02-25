const mongoose = require("mongoose");



const GiftSchema = new mongoose.Schema({
  giftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gift",
  },
  pointValue: {
    type: Number,
    required: true,
  },
});

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  gifts: [GiftSchema]
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
