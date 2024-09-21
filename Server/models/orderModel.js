const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        productPrice: {
          type: Number,
          required: true,
        },
        gifts: [
          {
            gift: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Gift",
            },
            pointValue: {
              type: Number,
            },
          },
        ],
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    shippingInfo: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      region: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      default: "ordersAwaiting",
      enum: [
        "ordersAwaiting",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
