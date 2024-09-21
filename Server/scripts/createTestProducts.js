const mongoose = require("mongoose");
const Product = require("../models/productModel"); // Import your Product model
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
    createTestProducts();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Function to create 100 test products
const createTestProducts = async () => {
  try {
    const products = [];

    for (let i = 1; i <= 100; i++) {
      const product = new Product({
        productName: `Test Product ${i}`,
        category: "66d5675f6ca631ba793c05eb", // Replace with an actual category ID
        stock: Math.floor(Math.random() * 100) + 1,
        realStock: Math.floor(Math.random() * 100) + 1,
        description: `This is a description for Test Product ${i}.`,
        price: (Math.random() * 100).toFixed(2),
        includingGift: Math.random() < 0.5, // Random boolean for includingGift
        giftPoints: Math.floor(Math.random() * 50),
        imagePath: [
          "http://localhost:3030/uploads/products/66dcb0b1d945ea8e4bab1de7/images-1725739185903.png",
          "http://localhost:3030/uploads/products/66dcb0b1d945ea8e4bab1de7/image-1725739194248.png"
        ],
        gifts: [], // Example gift, can be extended
        reviews: [],
        Ingredients: [],
        video: `https://youtube.com/watch?v=testvideo${i}`,
        size: `${Math.floor(Math.random() * 100)}ml`, // Random size
      });

      products.push(product);
    }

    // Insert all products in one go
    await Product.insertMany(products);
    console.log("100 test products created successfully.");
    process.exit(0); // Exit the script after successful creation
  } catch (error) {
    console.error("Error creating test products:", error.message);
    process.exit(1); // Exit the script with failure
  }
};
