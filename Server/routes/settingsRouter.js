const express = require("express");
const router = express.Router();
const {
  getLandingPage,
  updateLandingPage,
  createLandingPage,
} = require("../controllers/settings/LandingPageController");
const {
  getProductPage,
  createProductPage,
  updateProductPage,
} = require("../controllers/settings/ProductPageController");
const {
  getAbout,
  createAbout,
  updateAbout,
} = require("../controllers/settings/aboutController");
const {
  getPromotionPage,
  createPromotionPage,
  updatePromotionPage,
} = require("../controllers/settings/promotionPageController");
const { loginCheck, isAdmin } = require("../middlewares/authMiddleware");

router.get("/landingpage", getLandingPage);
router.get("/about", getAbout);
router.get("/productpage", getProductPage);
router.get("/promotionpage", getPromotionPage);

router.post("/promotionpage", loginCheck, isAdmin, createPromotionPage);
router.post("/landingpage", createLandingPage);
router.post("/productpage", createProductPage);
router.post("/about", createAbout);
router.put("/about", loginCheck, isAdmin, updateAbout);

router.put("/productpage", loginCheck, isAdmin, updateProductPage);
router.put("/promotionpage", loginCheck, isAdmin, updatePromotionPage);
router.put("/landingpage", loginCheck, isAdmin, updateLandingPage);

module.exports = router;
