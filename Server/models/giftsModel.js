const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
  {
    giftName: {
      type: String,
      required: true,
    },
    imagePath: [{ type: String, default: [] }],
    description: String,
    pointValue: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
      isDisabled:{
        type: Boolean,
        default: false,
      }
  },
  {
    timestamps: true,
  }
);

const GiftModel = mongoose.model("Gift", giftSchema);

module.exports = GiftModel;
