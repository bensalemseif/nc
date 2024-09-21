const express = require("express");
const router = express.Router();
const {
  createOrderFromCart,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrders,
} = require("../controllers/orderController");
const { loginCheck, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create", loginCheck, createOrderFromCart);
router.get("/user", loginCheck, getOrdersByUser);
router.get("/:id", loginCheck, getOrderById);
router.put("/:id", loginCheck, updateOrderStatus);
router.delete("/:id", loginCheck, deleteOrder);
router.get("/",loginCheck,isAdmin, getOrders);

module.exports = router;
