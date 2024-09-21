const Product = require('../models/productModel')

// Check if the requested quantity of a product is in stock
exports.isInStock = async (productId, requestedQuantity) => {
    try {
      const product = await Product.findById(productId);
      return product && product.stock >= requestedQuantity;
    } catch (err) {
      console.error(err.message);
      throw new Error('Error checking product stock');
    }
  };
  