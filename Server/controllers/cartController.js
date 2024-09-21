const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { selectGifts } = require("../utils/giftServices");


exports.addProductToCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const { selectedGiftIds, quantity  = 1 } = req.body; // Default quantity to 1 if not provided

  console.log(req.body)

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: []});
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity;
    } else {
    let gifts = [];
    if (selectedGiftIds && selectedGiftIds.length > 0) {
      const result = await selectGifts(product.giftPoints, selectedGiftIds);
      if (!result.success) {
        return res.status(400).json({ msg: result.message });
      }
      gifts = result.selectedGifts.map(gift => ({
        giftId: gift._id,
        pointValue: gift.pointValue,
      }));}
    cart.items.push({ productId: productId, quantity, gifts });
  }
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get user's cart
exports.getUserCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // Populate the entire category and promotion documents within productId
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.productId",
        populate: [
          { path: "category" },  // Populate the entire category document
          { path: "promotion" }  // Populate the entire promotion document
        ]
      })
      .populate("items.gifts.giftId"); // Populate gift details
      //console log all cart data as jison 
      console.log(JSON.stringify(cart, null, 2));
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      // Remove the product from the cart
      cart.items.splice(productIndex, 1);
      await cart.save();

      return res.json(cart);
    } else {
      return res.status(404).json({ msg: "Product not found in cart" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

exports.updateProductQuantityInCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex > -1) {
      cart.items[productIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      return res.status(404).json({ msg: "Product not found in cart" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


exports.updateProductQuantitiesInCart = async (req, res) => {
  console.log(req.body);
  const { products } = req.body; // expecting an array of { productId, quantity }
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Loop through each product and update the quantity
    products.forEach((product) => {
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === product.productId
      );

      if (productIndex > -1) {
        cart.items[productIndex].quantity = product.quantity;
      } else {
        // Optionally, handle the case where the product isn't found in the cart
        // This could be a decision to throw an error or to add the product to the cart
        return res.status(404).json({ msg: `Product ${product.productId} not found in cart` });
      }
    });

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
