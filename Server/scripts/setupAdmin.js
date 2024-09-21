const mongoose = require("mongoose");
const User = require("../models/userModel");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
    createAdmin();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Function to create admin user
const createAdmin = async () => {
  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin user already exists.");
      process.exit(0); // Exit the script
    }

    // Create a new admin user
    const adminUser = new User({
      userName: "admin",
      email: "admin@example.com",
      phoneNumber: "0000000000",
      password: "admin123",
      profile: {
        firstName: "Admin",
        lastName: "User",
        imagePath: "",
      },
      address: {
        streetAddress: "Admin Street 1",
        Region: "Admin Region",
        City: "Admin City",
        postalCode: "000000",
      },
      role: "admin",
      isVerified: true,
    });
    await adminUser.save();

    console.log("Admin user created successfully.");
    process.exit(0); // Exit the script after successful creation
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1); // Exit the script with failure
  }
};
