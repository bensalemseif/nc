const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const Message = require("./messageModel");
const Review = require("./reviewModel");
const Product = require("./productModel"); // Assuming the Product model is in the same directory
const Cart = require("./cartModel");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: { unique: true },
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profile: {
      firstName: String,
      lastName: String,
      imagePath: {
        type: String,
        default: "https://avatar.iran.liara.run/public",
      },
    },
    address: {
      streetAddress: { type: String, required: true },
      Region: { type: String, required: true },
      City: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted :{
      type: Boolean,
      default: false,
    },
    isVerified: { type: Boolean, default: false },
    otpCode: {
      type: Number,
    },
    otpCodeExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});



userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const userId = this._id;

    // Find all reviews created by this user
    const userReviews = await Review.find({ user: userId });

    if (userReviews.length > 0) {
      const reviewIds = userReviews.map(review => review._id);

      // Remove the reviews from any products' reviews array
      await Product.updateMany(
        { reviews: { $in: reviewIds } },
        { $pull: { reviews: { $in: reviewIds } } }
      );

      // Delete the reviews created by the user
      await Review.deleteMany({ _id: { $in: reviewIds } });
    }

    // Delete messages sent or received by the user
    a
    await Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] });
    await Cart.findOneAndDelete({ user: userId });
    // Proceed with the removal of the user
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});



const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
