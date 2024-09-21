const fs = require("fs");
const path = require("path");
const { uploadSingle, uploadMultiple } = require("../config/multerConfig");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Gift = require("../models/giftsModel");
const LandingPage = require("../models/settings/LandingPageModel");
const AboutPage = require("../models/settings/aboutModel");
const ProductPage = require("../models/settings/productPageModel");
const PromotionPage = require("../models/settings/promotionPageModel");
const Promotion = require("../models/promotionModel");
const Category = require("../models/categoryModel");
//BASE URL
const url = require('url');
const BASE_URL = process.env.BASE_URL;

// Helper function to ensure directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Upload single image
exports.uploadImage = async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No file selected!" });

    const uploadType = req.params.uploadType;
    const id = req.params.id;
    const imagePath = `${BASE_URL}uploads/${uploadType}s/${id}/${req.file.filename}`;
    const dir = path.join(__dirname, `../uploads/${uploadType}s/${id}`);

    ensureDirectoryExists(dir);

    try {
      const updateOps = {
        product: () => Product.findByIdAndUpdate(id, { $push: { imagePath } }),
        user: () => User.findByIdAndUpdate(id, { "profile.imagePath": imagePath }),
        gift: () => Gift.findByIdAndUpdate(id, { $set: { imagePath } }),
        promotion: () => Promotion.findByIdAndUpdate(id, { $set: { imagePath } }),
        categorie: () => Category.findByIdAndUpdate(id, { $set: { imagePath } }),
        landingPage: () => LandingPage.findOneAndUpdate({}, { $set: { imagePath } }),
        promotionPage: () => PromotionPage.findOneAndUpdate({}, { $set: { imagePath } }),
        productPage: () => ProductPage.findOneAndUpdate({}, { $set: { imagePath } }),
        aboutPage: () => AboutPage.findOneAndUpdate({}, { $set: { imagePath } })
      };

      if (!updateOps[uploadType]) {
        return res.status(400).json({ message: "Invalid upload type" });
      }

      await updateOps[uploadType]();

      res.status(200).json({
        message: "File uploaded successfully!",
        file: imagePath
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

// Upload multiple images (Product only)
exports.uploadImages = async (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files selected!" });

    const uploadType = req.params.uploadType;
    const id = req.params.id;

    // Ensure that the upload type is only "product"
    if (uploadType !== "product") {
      return res.status(400).json({ message: "Invalid upload type. Only product uploads are allowed." });
    }

    const filePaths = req.files.map((file) => `${BASE_URL}uploads/products/${id}/${file.filename}`);
    const dir = path.join(__dirname, `../uploads/products/${id}`);

    ensureDirectoryExists(dir);

    try {
      // Update the product with the uploaded images
      await Product.findByIdAndUpdate(id, {
        $push: { imagePath: { $each: filePaths } },
      });

      res.status(200).json({
        message: "Files uploaded successfully!",
        files: filePaths,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};




// Delete single image
exports.deleteImage = async (uploadType, id, imagePath) => {
  // Extract the relative file path from the full URL
  const parsedUrl = url.parse(imagePath);
  const imagePathEx = parsedUrl.pathname;
  // Create the full image path by joining the root directory with the relative image path
  const fullImagePath = path.join(__dirname, "../", imagePathEx);
  console.log(fullImagePath);
  fs.unlink(fullImagePath, async (err) => {
    if (err) {
      console.error(`Failed to delete image at ${fullImagePath}: ${err.message}`);
    } else {
      console.log(`Successfully deleted image at ${fullImagePath}`);
      try {
        const updateOps = {
          product: () => Product.findByIdAndUpdate(id, { $pull: { imagePath: imagePath } }),
          promotion: () => Promotion.findByIdAndUpdate(id, { $pull: { imagePath: imagePath } }),
          user: () => User.findByIdAndUpdate(id, { "profile.imagePath": "" }),
          gift: () => Gift.findByIdAndUpdate(id, { $pull: { imagePath: imagePath } }),
          categorie: () => Category.findByIdAndUpdate(id, { $pull: { imagePath: imagePath } }),
          landingPage: () => LandingPage.findOneAndUpdate({}, { $set: { imagePath: null } }),
          promotionPage: () => PromotionPage.findOneAndUpdate({}, { $set: { imagePath: null } }),
          productPage: () => ProductPage.findOneAndUpdate({}, { $set: { imagePath: null } }),
          aboutPage: () => AboutPage.findOneAndUpdate({}, { $set: { imagePath: null } })
        };

        if (!updateOps[uploadType]) {
          console.error("Invalid upload type");
          return;
        }

        await updateOps[uploadType]();
      } catch (dbErr) {
        console.error(`Failed to update database for ${uploadType} ${id}: ${dbErr.message}`);
      }
    }
  });
};


// Delete all images for a specific entity
exports.deleteImages = async (uploadType, id) => {
  const dir = path.join(__dirname, "../uploads/", `${uploadType}s`, id);

  fs.access(dir, fs.constants.F_OK, async (err) => {
    if (err) {
      console.log(`No images linked to ${uploadType} ${id}`);
      return;
    }

    fs.rm(dir, { recursive: true, force: true }, async (err) => {
      if (err) {
        console.error(`Failed to delete images for ${uploadType} ${id}: ${err.message}`);
      } else {
        console.log(`Successfully deleted images for ${uploadType} ${id}`);

        try {
          const updateOps = {
            product: () => Product.findByIdAndUpdate(id, { $set: { imagePath: [] } }),
            promotion: () => Promotion.findByIdAndUpdate(id, { $set: { imagePath: [] } }),
            gift: () => Gift.findByIdAndUpdate(id, { $set: { imagePath: [] } }),
            user: () => User.findByIdAndUpdate(id, { $set: { "profile.imagePath": "../assets/profile_Icon.jpg" } }),
            category: () => Category.findByIdAndUpdate(id, { $set: { imagePath: [] } }),
            landingPage: () => LandingPage.findOneAndUpdate({}, { $set: { imagePath: null } }),
            promotionPage: () => PromotionPage.findOneAndUpdate({}, { $set: { imagePath: null } }),
            productPage: () => ProductPage.findOneAndUpdate({}, { $set: { imagePath: null } }),
            aboutPage: () => AboutPage.findOneAndUpdate({}, { $set: { imagePath: null } })
          };

          if (!updateOps[uploadType]) {
            console.error("Invalid upload type");
            return;
          }

          await updateOps[uploadType]();
        } catch (dbErr) {
          console.error(`Failed to update database for ${uploadType} ${id}: ${dbErr.message}`);
        }
      }
    });
  });
};

// Update user image
// exports.updateImage = async (req, res, next) => {
//   uploadSingle(req, res, async (err) => {
//     if (err) return res.status(400).json({ message: err.message });
//     if (!req.file) return res.status(400).json({ message: "No file selected!" });

//     const uploadType = "user";
//     const id = req.user.id;
//     const oldImagePath = req.body.oldImagePath;
//     const newImagePath = `uploads/${uploadType}s/${id}/${req.file.filename}`;

//     try {
//       await User.findByIdAndUpdate(id, { $set: { "profile.profilePicture": newImagePath } });

//       if (oldImagePath) {
//         const fullOldImagePath = path.join(__dirname, "../../", oldImagePath);
//         fs.unlink(fullOldImagePath, (err) => {
//           if (err) {
//             console.error(`Failed to delete old image at ${fullOldImagePath}: ${err.message}`);
//           } else {
//             console.log(`Successfully deleted old image at ${fullOldImagePath}`);
//           }
//         });
//       }

//       res.status(200).json({
//         message: "Image updated successfully!",
//         file: newImagePath
//       });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });
// };
