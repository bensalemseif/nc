const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProductById,
  deleteProductById,
  getAllProducts,
  getProductById,
  toggleProductDisableById,
  getAllProductsADMIN,
  getProductByIdADMIN,
} = require("../controllers/productController");
const { loginCheck, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", loginCheck, isAdmin, createProduct);
router.put("/:id", loginCheck, isAdmin, updateProductById);
router.delete("/:id", loginCheck, isAdmin, deleteProductById);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.get("/admin/getall", loginCheck, isAdmin, getAllProductsADMIN);
router.get("/admin/getByid/:id", loginCheck, isAdmin, getProductByIdADMIN);
router.put("/disable/:id", loginCheck, isAdmin, toggleProductDisableById);

module.exports = router;
