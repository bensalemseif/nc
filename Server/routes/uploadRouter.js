const express = require("express");
const router = express.Router();
const {
  uploadImage,
  uploadImages,
  deleteImage,
  deleteImages,
  // updateImage,
} = require("../utils/uploadsHandler"); // Adjust the path to your controller file

// Route to upload a single image
router.post("/add/:uploadType/:id", uploadImage);

// Route to upload multiple images
router.post("/add/multiple/:uploadType/:id", uploadImages);

// Route to delete a specific image (DELETE HTTP Method is used for deletion)
router.delete("/delete-image/:uploadType/:id", async (req, res) => {
  const { uploadType, id } = req.params;
  const { imagePath } = req.body;
  try {
    await deleteImage(uploadType, id, imagePath);
    res.status(200).json({ message: "Image deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to delete all images for a specific upload type and ID
router.delete("/delete-images/:uploadType/:id", async (req, res) => {
  const { uploadType, id } = req.params;
  try {
    await deleteImages(uploadType, id);
    res.status(200).json({ message: "All images deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update an image for a user (Only for the user's own profile picture)
// router.put("/update-image", updateImage);

module.exports = router;
