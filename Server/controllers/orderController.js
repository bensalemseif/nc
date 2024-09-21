const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

exports.createOrderFromCart = async (req, res) => {
  const userId = req.user.id;
  const { email, phone, address, region, city, postalCode } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.productId",
        populate: [{ path: "category" }, { path: "promotion" }],
      })
      .populate("items.gifts.giftId");

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Check stock and update for each product in parallel
    const productUpdates = cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product)
        throw new Error(`Product with ID ${item.productId._id} not found`);
      if (product.stock < item.quantity)
        throw new Error(
          `Insufficient stock for product ${product.productName}`
        );

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    });

    // Run all product updates in parallel
    await Promise.all(productUpdates);

    // Calculate total price
    const total = cart.items.reduce(
      (acc, item) => acc + item.productId.finalPrice * item.quantity,
      0
    );

    // Map products to order format
    const products = cart.items.map((item) => ({
      product: item.productId._id,
      quantity: item.quantity,
      productPrice: item.productId.finalPrice,
      gifts: item.gifts.map((gift) => ({
        gift: gift.giftId._id,
        pointValue: gift.giftId.pointValue,
      })),
    }));

    // Create the order
    const order = new Order({
      user: userId,
      products,
      total,
      status: "ordersAwaiting",
      shippingInfo: {
        email,
        phone,
        address,
        city,
        region,
        postalCode,
      },
    });

    // Save the order and clear the cart
    await order.save();
    cart.items = [];
    await cart.save();

    // Send the response with the order data
    return res.status(201).json(order);
  } catch (err) {
    // Error handling with proper logging
    console.error("Error creating order:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to create order. Please try again." });
  }
};

// Get all orders for a specific user
exports.getOrdersByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .populate("products.gifts.gift") // Populate gift details for each product
      .populate("user"); // Populate user information

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all orders for all users (admin) with sorting and pagination
exports.getOrders = async (req, res) => {
  try {
    // Extract page and limit from query parameters (defaults to page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch total number of orders for pagination purposes
    const totalOrders = await Order.countDocuments();

    // Fetch orders with pagination, sorting by creation date (descending order)
    const orders = await Order.find()
      .populate("user")
      .populate("products.product")
      .populate("products.gifts.gift")
      .sort({ createdAt: -1 }) // Sort by date in descending order (most recent first)
      .skip(skip)
      .limit(limit);

    // Return the orders along with pagination info
    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product") // Populate product details
      .populate("products.gifts.gift"); // Populate gift details for each product

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("products.product") // Populate product details
      .populate("products.gifts.gift"); // Populate gift details for each product

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    await order.remove();
    res.json({ msg: "Order deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
