const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      stock,
      realStock,
      description,
      price,
      sellingPrice,
      includingGift,
      giftPoints,
      gifts,
      reviews,
      Ingredients,
      video,
      size,
    } = req.body;

    const newProduct = new Product({
      productName,
      category,
      stock,
      realStock,
      description,
      price,
      sellingPrice,
      includingGift,
      giftPoints,
      gifts,
      reviews,
      video,
      Ingredients,
      size,
    });

    await newProduct.save();
    res.status(201).json(newProduct._id);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "finalPrice",
      sortOrder = "asc",
      minPrice,
      maxPrice,
      showPromotions = false,
      showGifts = false,
      categories,
      rating,
      search,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const minPriceNumber = parseFloat(minPrice);
    const maxPriceNumber = parseFloat(maxPrice);
    const showPromotionsBool = showPromotions === "true";
    const showGiftsBool = showGifts === "true";

    // Create a filter object
    const filter = { isDisabled: false };

    // Search by productName or description
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // show only product with promotion if promotion true
    if (showPromotionsBool) {
      filter.promotion = { $ne: null };
    }

    // show only product with gift if gift true
    if (showGiftsBool) {
      filter.includingGift = { $ne: false };
    }

    // Category filter (including subcategories)
    if (categories) {
      // Find all subcategories of the selected category
      const allCategoryIds = [categories]; // Start with the selected category
      const categoriesWithSubcategories = await Category.find({
        $or: [{ _id: categories }, { parent: categories }],
      });

      // Add the ids of the found subcategories
      categoriesWithSubcategories.forEach(cat => {
        allCategoryIds.push(cat._id);
      });

      filter.category = { $in: allCategoryIds }; // Apply filter for category and subcategories
    }

    // Query the products based on non-virtual fields
    const query = Product.find(filter)
      .populate({
        path: "category",
        match: { isDisabled: false },
      })
      .populate({
        path: "reviews",
        match: { isValid: true },
      })
      .populate("promotion")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Fetch products
    let products = await query.exec();

    // Filter by virtual finalPrice (post-query)
    if (!isNaN(minPriceNumber) || !isNaN(maxPriceNumber)) {
      products = products.filter((product) => {
        const price = product.finalPrice;
        return (
          (isNaN(minPriceNumber) || price >= minPriceNumber) &&
          (isNaN(maxPriceNumber) || price <= maxPriceNumber)
        );
      });
    }

    // Filter by virtual AVGrating (post-query)
    if (rating) {
      products = products.filter((product) => product.AVGrating >= rating);
    }

    // Re-sort by virtual finalPrice if necessary
    if (sortBy === "finalPrice") {
      products = products.sort((a, b) => {
        const priceA = a.finalPrice;
        const priceB = b.finalPrice;
        return sortOrder === "desc" ? priceB - priceA : priceA - priceB;
      });
    }
    //console log map product categories isDisabele 

    // Get total count of products (before applying virtual filters)
    const totalProducts = await Product.countDocuments(filter);

    res.json({
      data: products,
      totalPages: Math.ceil(totalProducts / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


exports.getProductById = async (req, res) => {
  try {
    // Find the product by ID, ensure it's active, and the category is also active
    const product = await Product.findOne({
      _id: req.params.id,
      isDisabled: false, // Ensure the product is active
    })
      .populate("gifts")
      .populate({
        path: "category",
        match: { isDisabled: false }, // Ensure the category is active
      })
      .populate("promotion")
      .populate({
        path: "reviews", // Populate the reviews array
        match: { isValid: true }, // Only include reviews where isValid is true
        populate: {
          path: "user", // Populate the user field within each review
          select: "userName", // Select the userName field from the User model
        },
      });

    // If the product doesn't exist or its category is inactive
    if (!product || !product.category) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllProductsADMIN = async (req, res) => {
  try {
    // Extract query parameters
    const { search = "", page = 1, limit = 10 } = req.query;
    console.log(search)
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Create a search query if a search term is provided
    const searchQuery = search ? { productName: { $regex: search, $options: 'i' } } : {};

    // Find and paginate products
    const products = await Product.find(searchQuery)
      .populate("category")
      .populate({
        path: "reviews",
        match: { isValid: true }, // Only include reviews where isValid is true
      })
      .populate("promotion")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Count total products for pagination info
    const totalProducts = await Product.countDocuments(searchQuery);

    // Send response with data and pagination info
    res.json({
      data: products,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
        totalItems: totalProducts,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get a product by ID
exports.getProductByIdADMIN = async (req, res) => {
  try {
    // Populate the reviews with the user data
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("promotion")
      .populate({
        path: "reviews", // Populate the reviews array
        populate: {
          path: "user", // Populate the user field within each review
          select: "userName", // Select the userName field from the User model
        },
      });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateProductById = async (req, res) => {
  const {
    productName,
    category,
    stock,
    realStock,
    description,
    price,
    sellingPrice,
    includingGift,
    giftPoints,
    gifts,
    Ingredients,
    video,
    size,
  } = req.body;

  // Build product object
  const productFields = {};
  if (productName) productFields.productName = productName;
  if (category) productFields.category = category;
  if (stock) productFields.stock = stock;
  if (realStock) productFields.realStock = realStock;
  if (description) productFields.description = description;
  if (price) productFields.price = price;
  if (sellingPrice) productFields.sellingPrice = sellingPrice;
  productFields.includingGift = includingGift;
  if (giftPoints) productFields.giftPoints = giftPoints;
  if (gifts) productFields.gifts = Array.isArray(gifts) ? gifts : [gifts]; // Ensure gifts is an array of ObjectIds
  if (Ingredients) productFields.Ingredients = Ingredients;
  if (video) productFields.video = video;
  if (size) productFields.size = size;

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
exports.deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// disable product

exports.toggleProductDisableById = async (req, res) => {
  try {
    const { isDisable } = req.body; // Get the status from the request body

    // Check if status is a boolean value
    if (typeof isDisable !== "boolean") {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isDisabled: isDisable } },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
