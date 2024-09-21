const ProductPage = require("../../models/settings/productPageModel");

//create ProductPage content
exports.createProductPage = async (req, res) => {
  try {
    const productPageData = req.body;
    const productPage = await ProductPage.create(productPageData);
    res.status(201).json({ message: "product page created successfully", data: productPage });
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get ProductPage content
exports.getProductPage = async (req, res) => {
  try {
    const productPage = await ProductPage.findOne();
    res.status(200).json(productPage);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ProductPage content" });
  }
};

// Update ProductPage content
exports.updateProductPage = async (req, res) => {
  try {
    const productPageData = req.body;
    const productPage = await ProductPage.findOneAndUpdate(
      {},
      productPageData,
      { new: true, upsert: true }
    );
    res.status(200).json(productPage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update ProductPage content" });
  }
};
