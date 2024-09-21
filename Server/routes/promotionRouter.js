const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");
const { loginCheck, isAdmin } = require("../middlewares/authMiddleware");


router.post("/",loginCheck,isAdmin, promotionController.createPromotion);
router.get("/", promotionController.getPromotions);
router.get("/upcoming", promotionController.getUpcomingPromotions);
router.get("/active", promotionController.getActivePromotions);
router.get("/:id", promotionController.getPromotionById);
router.put("/:id",loginCheck,isAdmin, promotionController.updatePromotion);
router.delete("/:id",loginCheck,isAdmin, promotionController.deletePromotion);

router.put("/:id/assign",loginCheck,isAdmin, promotionController.assignPromotionToProducts);
router.put("/:id/remove",loginCheck,isAdmin, promotionController.removePromotionFromProducts);

module.exports = router;
