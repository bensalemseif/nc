const express = require("express");
const router = express.Router();
const {
    getGifts,
    getGiftById,
    createGift,
    updateGift,
    deleteGift,
    toggleGiftDisableById
} = require("../controllers/giftsController");
const { loginCheck, isAdmin } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getGifts);
router.get("/:id", loginCheck, getGiftById);

// Private routes (admin only)
router.post("/", loginCheck, isAdmin, createGift);
router.delete("/:id", loginCheck, isAdmin, deleteGift);
router.put("/:id", loginCheck, isAdmin, updateGift);
router.put("/disable/:id", loginCheck, isAdmin, toggleGiftDisableById);

module.exports = router;
