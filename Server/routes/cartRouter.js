const express = require("express");
const router = express.Router();
const {
    getUserCart,
    addProductToCart,
    updateProductQuantitiesInCart,
    removeItemFromCart,
} = require("../controllers/cartController");
const { loginCheck } = require("../middlewares/authMiddleware");

router.get("/", loginCheck, getUserCart);
router.post("/:productId", loginCheck, addProductToCart);
router.put("/", loginCheck, updateProductQuantitiesInCart);
router.delete("/:productId", loginCheck, removeItemFromCart);

module.exports = router;    
