const productCategoryModel = require('../../models/products/productCategoryModel');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');
const APIfeature = require('../../utils/APIfeature');

// Add Product Category
const addProductCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, description, color } = req.body;

  if (!name || !description || !color) {
    return next(new ErrorHandler('Please provide all required fields: name, description, and color.', 400));
  }

  try {
    // Check if a category with the same name already exists
    const allCategories = await productCategoryModel.getAllProductsCategory();
    const existingCategory = allCategories.find(category => category.name.toLowerCase() === name.toLowerCase());

    if (existingCategory) {
      return next(new ErrorHandler('Category already exists, please use a different category name', 400));
    }

    // Create new product category
    const newProductCategory = await productCategoryModel.createProductsCategory({ name, description, color });

    res.status(201).json({
      success: true,
      data: newProductCategory,
    });
  } catch (error) {
    console.error('Error creating product category:', error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get All Product Categories
const getAllProductCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const resPerPage = 10; // You can adjust this or make it dynamic
    const currentPage = Number(req.query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const [categories, totalCategories] = await Promise.all([
      productCategoryModel.getAllProductsCategory(),
      productCategoryModel.getTotalProductsCategoryCount()
    ]);

    // Paginate categories
    const paginatedCategories = categories.slice(skip, skip + resPerPage);

    res.status(200).json({
      success: true,
      count: paginatedCategories.length,
      totalCategories: Number(totalCategories),
      resPerPage,
      categories: paginatedCategories
    });
  } catch (error) {
    console.error('Error fetching all product categories:', error);
    return next(new ErrorHandler('Error fetching product categories', 500));
  }
});

module.exports = {
  addProductCategory,
  getAllProductCategory
};
