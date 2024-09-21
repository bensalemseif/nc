const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set storage engine with dynamic directory creation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadType = req.params.uploadType; // Assuming uploadType is passed as a URL parameter
    const id = req.params.id; // Assuming an id (productId, userId, giftId) is passed as a URL parameter
    let uploadPath;

    switch (uploadType) {
      case "product":
        uploadPath = path.join("uploads", "products", id);
        break;
      case "user":
        uploadPath = path.join("uploads", "users", id);
        break;
      case "gift":
        uploadPath = path.join("uploads", "gifts", id);
        break;
      case "categorie":
        uploadPath = path.join("uploads", "categories", id);
        break;
      case "promotion":
        uploadPath = path.join("uploads", "promotions", id);
        break;
      case "landingPage":
        uploadPath = path.join("uploads", "landingPages", id);
        break;
      case "promotionPage":
        uploadPath = path.join("uploads", "promotionPages", id);
        break;
      case "productPage":
        uploadPath = path.join("uploads", "productPages", id);
        break;
      case "aboutPage":
        uploadPath = path.join("uploads", "aboutPages", id);
        break;
      default:
        return cb(new Error("Invalid upload type"), null);
    }


    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer for single and multiple uploads
const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image"); // 'image' is the field name in the form

const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 15000000 }, // Limit size to 15MB per file
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("images", 10);

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

module.exports = { uploadSingle, uploadMultiple };
