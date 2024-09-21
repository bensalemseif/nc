const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  imagePath:{
    type: String,
    default :''
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  isDisabled:{
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// Pre-hook for cascading delete
categorySchema.pre('findOneAndDelete', async function(next) {
  try {
    const category = await this.model.findOne(this.getFilter());
    if (category) {
      // Delete all subcategories
      await this.model.deleteMany({ parent: category._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to get subcategories
categorySchema.methods.getSubcategories = async function() {
  return await mongoose.model('Category').find({ parent: this._id });
};

// Pre-hook for cascading delete
categorySchema.pre('findOneAndDelete', async function(next) {
  try {
    const category = await this.model.findOne(this.getFilter());
    if (category) {
      // Delete all products in this category
      await Product.deleteMany({ category: category._id });

      // Recursively delete all subcategories and their products
      await deleteSubcategories(category._id);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Function to recursively delete subcategories and their products
async function deleteSubcategories(categoryId) {
  try {
    // Find all subcategories
    const subcategories = await Category.find({ parent: categoryId });
    
    for (const subcategory of subcategories) {
      // Delete all products in the subcategory
      await Product.deleteMany({ category: subcategory._id });

      // Recursively delete subcategories
      await deleteSubcategories(subcategory._id);
    }

    // Delete the subcategories themselves
    await Category.deleteMany({ parent: categoryId });
  } catch (error) {
    console.error(`Error deleting subcategories: ${error.message}`);
    throw error; // Re-throw the error to be handled by the pre-hook
  }
}


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
