const Gift = require("../models/giftsModel");
const { selectGifts } = require("../utils/giftServices");

exports.getGifts = async (req, res) => {
  try {
    const gifts = await Gift.find();
    return res.status(200).json(gifts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.getGiftById = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) {
      return res.status(404).json({ msg: "Gift not found" });
    }
    res.status(200).json(gift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


exports.createGift = async (req, res) => {
  const { giftName, pointValue, stock, categoryId } = req.body;

  try {
    const newGift = new Gift({
      giftName,
      stock,
      pointValue,
      categoryId,
    });

    await newGift.save();
    res.status(201).json(newGift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
exports.updateGift = async (req, res) => {
  const { giftName, pointValue, stock } = req.body;

  try {
    const gift = await Gift.findByIdAndUpdate(
      { _id: req.params.id },
      { giftName,  pointValue, stock },
      { new: true, runValidators: true }
    );

    if (!gift) {
      return res.status(404).json({ msg: "Gift not found" });
    }

    res.status(200).json(gift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findOneAndDelete({ _id: req.params.id });

    if (!gift) {
      return res.status(404).json({ msg: "Gift not found" });
    }

    res.status(200).json({ msg: "Gift removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


// disable product 

exports.toggleGiftDisableById = async (req, res) => {
  try {
    const { isDisable } = req.body; // Get the status from the request body

    // Check if status is a boolean value
    if (typeof isDisable !== 'boolean') {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const gift = await Gift.findByIdAndUpdate(
      req.params.id,
      { $set: { isDisabled: isDisable } },
      { new: true, runValidators: true }
    );

    if (!gift) {
      return res.status(404).json({ msg: "Gift not found" });
    }

    res.json(gift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}
