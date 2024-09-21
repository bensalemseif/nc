const express = require("express");
const router = express.Router();
const  {
    createCategory,
    updateCategory,
    toggleCategoryDisableById,
    deleteCategory,




    getAllCategories,
    getCategoryById,
    getSubCategory,
    getParentCatUser,
    getParentCatAdmin
}= require("../controllers/categoryController");
const { loginCheck, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", getParentCatUser);
router.get("/adnin/parent", getParentCatAdmin);

router.get("/:id", getCategoryById);
router.get("/subcategories/:id", getSubCategory);


//asmin selection
router.get('/select/all',getAllCategories);





router.post("/", loginCheck, isAdmin, createCategory);
router.put("/:id", loginCheck, isAdmin, updateCategory);
router.delete("/:id", loginCheck, isAdmin, deleteCategory);
router.put("/disable/:id", loginCheck, isAdmin, toggleCategoryDisableById);


module.exports = router;
