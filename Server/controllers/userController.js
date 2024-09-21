const userModel = require("../models/userModel");
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { profile, address, phoneNumber, email } = req.body;

  try {
    // Build the update object
    const updateFields = {
      "profile.firstName": profile?.firstName,
      "profile.lastName": profile?.lastName,
      "address.streetAddress": address?.streetAddress,
      "address.Region": address?.Region,
      "address.City": address?.City,
      "address.postalCode": address?.postalCode,
      phoneNumber,
      email,
    };

    // Remove fields with undefined values
    for (const key in updateFields) {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    }

    // Find the user by ID and update
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all users (admin) with sorting and pagination
exports.getAllUsers = async (req, res) => {
  try {
    // Destructure query parameters for pagination and sorting
    const { sortBy = "createdAt", sortOrder = "asc" } = req.query;

    // Convert page and limit to numbers
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Validate sortOrder
    const validSortOrders = ["asc", "desc"];
    const order = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

    // Fetch users with pagination and sorting
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("-password")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({ _id: { $ne: req.user.id } });

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get user by ID (admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete user by ID (admin)
exports.deleteUserById = async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.toggleUserStatusById = async (req, res) => {
  try {
    const { isDisable } = req.body; // Get the status from the request body

    // Check if status is a boolean value
    if (typeof isDisable !== "boolean") {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isDisabled: isDisable } },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User Toggle succssed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  const isMatch = await bcryptjs.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
  user.password = newPassword;
  try {
    await user.save();
    return res.json({ msg: "success" });
  } catch (err) {
    return res.json({ msg: "error" });
  }
};
