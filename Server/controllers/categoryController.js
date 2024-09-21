const Category = require("../models/categoryModel");
const Product = require("../models/productModel");


// Get parent categories as a user
exports.getParentCatUser = async (req, res) => {
  try {
    const categories = await Category.find({parent:null , isDisabled:false});
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching category:", error);
    res
    .status(500)
    .json({ message: "An error occurred while fetching the category tree." });
  }
};
// Get parent categories as admin
exports.getParentCatAdmin = async (req, res) => {
  try {
    const categories = await Category.find({parent:null});
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching category:", error);
    res
    .status(500)
    .json({ message: "An error occurred while fetching the category tree." });
  }
};


// Get all categories as admin
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching category:", error);
    res
    .status(500)
    .json({ message: "An error occurred while fetching the category tree." });
  }
};







// Get subCategory add role base fetching
exports.getSubCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    const subcategories = await category.getSubcategories();
    res.json(subcategories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

























////*********////************************/*/** */ */ */,,??

// Get a single category by ID with subcategories
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id,{isDisabled:false});
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    const subcategories = await category.getSubcategories();
    res.json({ category, subcategories });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};








// Update a category
exports.updateCategory = async (req, res) => {
  const { name, parent } = req.body;
  console.log(req.body)
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    
    category.name = name || category.name;
    category.parent = parent || category.parent;
    
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};




// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};













exports.toggleCategoryDisableById = async (req, res) => {
  try {
    const { isDisable } = req.body; // Get the status from the request body
    // Check if status is a boolean value
    if (typeof isDisable !== "boolean") {
      return res.status(400).json({ msg: "Invalid status value" });
    }
    
    // Find the category and update its isDisabled status
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { isDisabled: isDisable } },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    
    // Disable all subcategories of this category
    await Category.updateMany(
      { parent: req.params.id }, // Assuming `parentCategory` is the field that links subcategories to their parent
      { $set: { isDisabled: isDisable } }
    );
    
    // Disable all products of this category and its subcategories
    await Product.updateMany(
      {  category: req.params.id }, // Assuming `subCategory` is the field that links products to subcategories
      { $set: { isDisabled: isDisable } }
    );
    
    res.json({ msg: "Category and related subcategories and products updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


exports.createCategory = async (req, res) => {
  const { name, parent } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Check if the parent category exists
    if (parent && parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res
          .status(400)
          .json({ message: "Parent category does not exist" });
      }
    }

    // Create the new category
    const category = new Category({ name, parent });
    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};