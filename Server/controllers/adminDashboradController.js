// controllers/adminStatsController.js

const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Category = require("../models/categoryModel");
const GiftModel = require("../models/giftsModel");


// getAdminTopProducts:
exports.getAdminTopProducts = async (req, res) => {
  try {
    // Implement logic to get top-selling products if order status: 'Delivered'
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 8 },
    ]);
    console.log(topProducts)
    // Fetch product details based on _id (product ID)
    const productIds = topProducts.map((product) => product._id);
    const products = await Product.find({ _id: { $in: productIds } }).populate("promotion");
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// getAdminTopCategories:
exports.getAdminTopCategories = async (req, res) => {
  try {
    // Implement logic to get top-selling categories
    const topCategories = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.categoryId",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);
    // Fetch category details based on _id (category ID)
    const categoryIds = topCategories.map((category) => category._id);
    const categories = await Category.find({ _id: { $in: categoryIds } });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// getAdminTopGifts:
exports.getAdminTopGifts = async (req, res) => {
  try {
    // Implement logic to get top-selling gifts
    const topGifts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.giftId",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);
    // Fetch gift details based on _id (gift ID)
    const giftIds = topGifts.map((gift) => gift._id);
    const gifts = await GiftModel.find({ _id: { $in: giftIds } });
    res.json(gifts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getOrderByYear = async (req, res) => {
  const year = parseInt(req.params.year);

  try {
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getOrderStatsByStatus = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Convert the stats array into an object with status: count
    const statusCounts = {};
    stats.forEach(stat => {
      statusCounts[stat.status] = stat.count;
    });

    res.status(200).json({
      success: true,
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//api get document count of Number of product , users, order, categorys 

exports.getNumberStat = async (req,res) =>{
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments({ isVerified: true, isBlocked: false ,role:'user' });
    const orderCount = await Order.countDocuments();
    const categoryCount = await Category.countDocuments();
    res.json({ productCount, userCount, orderCount, categoryCount });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}


exports.getFinancialStats = async (req, res) => {
  try {
    // Total revenue
    const totalRevenue = await Order.aggregate([
      { $unwind: "$products" },  // Flatten the products array
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$products.quantity", "$products.productPrice"] } }
        }
      }
    ]);

    // Average order value
    const averageOrderValue = await Order.aggregate([
      { $unwind: "$products" },  // Flatten the products array
      {
        $group: {
          _id: "$_id",  // Group by order ID to calculate order totals
          orderTotal: { $sum: { $multiply: ["$products.quantity", "$products.productPrice"] } }
        }
      },
      {
        $group: {
          _id: null,
          averageValue: { $avg: "$orderTotal" }
        }
      }
    ]);

    // Monthly revenue
    const monthlyRevenue = await Order.aggregate([
      { $unwind: "$products" },  // Flatten the products array
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          monthlyTotal: { $sum: { $multiply: ["$products.quantity", "$products.productPrice"] } }
        }
      },
      {
        $group: {
          _id: "$_id.year",
          monthlyRevenue: {
            $push: {
              month: "$_id.month",
              revenue: "$monthlyTotal"
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      averageOrderValue: averageOrderValue[0]?.averageValue || 0,
      monthlyRevenue: monthlyRevenue[0]?.monthlyRevenue || []
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};




exports.getNewUsers = async (req, res) => {
  try {
    const today = new Date();
    const last30Days = new Date(today.setDate(today.getDate() - 30));

    const newUsers = await User.countDocuments({
      createdAt: { $gte: last30Days } , role : "user"
    });

    res.json({ newUsers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


// controllers/adminStatsController.js
exports.getMonthlyRevenueByYear = async (req, res) => {
  const year = parseInt(req.params.year);

  try {
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
      { $unwind: "$products" },
      { $group: { _id: { $month: "$createdAt" }, totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.productPrice"] } } } },
      { $sort: { _id: 1 } }
    ]);

    res.json(monthlyRevenue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
