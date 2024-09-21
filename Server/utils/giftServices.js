// services/giftService.js
const Gift = require("../models/giftsModel");

selectGifts = async (giftPoints, selectedGiftIds) => {
  let totalPoints = 0;
  const selectedGifts = [];

  for (const giftId of selectedGiftIds) {
    const gift = await Gift.findById(giftId);

    if (!gift) {
      return {
        success: false,
        message: `Gift with ID ${giftId} not found`,
      };
    }

    totalPoints += gift.pointValue;
    selectedGifts.push(gift);
  }

  if (totalPoints <= giftPoints) {
    return {
      success: true,
      message: "Gifts selected successfully.",
      selectedGifts,
    };
  } else {
    return {
      success: false,
      message: "Exceeded gift points limit.",
    };
  }
};

module.exports = { selectGifts };
