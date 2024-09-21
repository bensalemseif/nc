const express = require("express");
const router = express.Router();
const {
    addReview,
    getReviewById,
    updateReviewById,
    deleteReviewById,
    getReviewsByProductId,
    changeValidation
} = require("../controllers/reviewController");
const { loginCheck } = require("../middlewares/authMiddleware");

router.post("/:productId", loginCheck, addReview);
router.get("/:id", getReviewById);
router.put("/:id", loginCheck, updateReviewById);
router.delete("/:id", loginCheck, deleteReviewById);
router.put("/validation/:reviewId", loginCheck, changeValidation);
router.get("/product/:productId", getReviewsByProductId);
router.get("/product/:productId", getReviewsByProductId);
module.exports = router;
