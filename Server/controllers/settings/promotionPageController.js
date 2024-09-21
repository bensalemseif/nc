const PromotionPage = require("../../models/settings/promotionPageModel");

//create Promotion page :
exports.createPromotionPage = async (req, res) => {
  try {
    const promotionPageData = req.body;
    const promotionPage = await PromotionPage.create(promotionPageData);
    res
      .status(201)
      .json({   
        message: "Promotion page created successfully",
        data: promotionPage,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating promotion page", error: error.message });
  }
};
// Get PromotionPage content
exports.getPromotionPage = async (req, res) => {
  try {
    const promotionPage = await PromotionPage.findOne();
    res.status(200).json(promotionPage);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch PromotionPage content" });
  }
};

// Update PromotionPage content
exports.updatePromotionPage = async (req, res) => {
  try {
    const promotionPageData = req.body;
    const promotionPage = await PromotionPage.findOneAndUpdate(
      {},
      promotionPageData,
      { new: true, upsert: true }
    );
    res.status(200).json(promotionPage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update PromotionPage content" });
  }
};
