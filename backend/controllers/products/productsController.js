const productsModel = require('../../models/products/productsModel');
const multer = require('multer');
const path = require('path');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products');
  },
  filename: function (req, file, cb) {
    cb(null, 'snapshot-' + Date.now() + path.extname(file.originalname));
  }
});

// Configure Multer file filter
const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

// Add Product
const addProduct = catchAsyncErrors(async (req, res, next) => {
  upload.single('snapshot')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 400));
    }

    const { name, product_category, description, price, ratings } = req.body;

    if (!name || !product_category || !price) {
      return next(new ErrorHandler('Required fields missing', 400));
    }

    const snapshot = req.file ? req.file.path : null;

    try {
      const newProduct = await productsModel.createProduct({ name, product_category, description, snapshot, price, ratings });
      res.status(201).json({
        success: true,
        product: newProduct
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
});

// Get All Products
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await productsModel.getAllProducts();
  res.status(200).json({
    success: true,
    products
  });
});

// Get Product Details
const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await productsModel.getProductById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  res.status(200).json({
    success: true,
    product
  });
});

// Update Product
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  upload.single('snapshot')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 400));
    }

    const { name, product_category, description, price, ratings } = req.body;
    const snapshot = req.file ? req.file.path : null;

    try {
      const updatedProduct = await productsModel.updateProduct(req.params.id, { name, product_category, description, snapshot, price, ratings });
      if (!updatedProduct) {
        return next(new ErrorHandler('Product not found', 404));
      }
      res.status(200).json({
        success: true,
        product: updatedProduct
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
});

// Delete Product
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await productsModel.getProductById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  await productsModel.deleteProduct(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Create Product Review
const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { product_id, user_id, review_text, rating } = req.body;
  const review = await productsModel.createProductReview({ product_id, user_id, review_text, rating });
  res.status(201).json({
    success: true,
    review
  });
});

// Get Product Reviews
const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await productsModel.getProductReviews(req.params.product_id);
  res.status(200).json({
    success: true,
    reviews
  });
});

// Delete Review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  await productsModel.deleteReview(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

module.exports = {
  addProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview
};

// const productsModel = require('../../models/products/productsModel');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
// const ErrorHandler = require('../../utils/errorHandler');

// // Configure Multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/products');
//   },
//   filename: function (req, file, cb) {
//     cb(null, 'snapshot-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Configure Multer file filter
// const upload = multer({ 
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Images only!'));
//     }
//   }
// });

// // Add Product
// // const addProduct = catchAsyncErrors(async (req, res, next) => {
// //   upload.single('snapshot')(req, res, async (err) => {
// //     if (err) {
// //       return next(new ErrorHandler(err.message, 400));
// //     }

// //     const { name, product_category, description, price, ratings } = req.body;
// //     const snapshot = req.file ? req.file.path : null;

// //     const newProduct = await productsModel.createProduct({ name, product_category, description, snapshot, price, ratings });
// //     res.status(201).json({
// //       success: true,
// //       product: newProduct
// //     });
// //   });
// // });
// const addProduct = catchAsyncErrors(async (req, res, next) => {
//     upload.single('snapshot')(req, res, async (err) => {
//       if (err) {
//         return next(new ErrorHandler(err.message, 400));
//       }
  
//       const { name, product_category, description, price, ratings } = req.body;
  
//       // Validate required fields
//       if (!name) {
//         return next(new ErrorHandler('Product name is required', 400));
//       }
  
//       // You may want to add similar validations for other required fields
//       if (!product_category) {
//         return next(new ErrorHandler('Product category is required', 400));
//       }
  
//       if (!price) {
//         return next(new ErrorHandler('Product price is required', 400));
//       }
  
//       const snapshot = req.file ? req.file.path : null;
  
//       try {
//         const newProduct = await productsModel.createProduct({ name, product_category, description, snapshot, price, ratings });
//         res.status(201).json({
//           success: true,
//           product: newProduct
//         });
//       } catch (error) {
//         // If there's still an error, pass it to the error handler
//         return next(new ErrorHandler(error.message, 500));
//       }
//     });
//   });

// // Get All Products
// const getAllProducts = catchAsyncErrors(async (req, res, next) => {
//   const products = await productsModel.getAllProducts();
//   res.status(200).json({
//     success: true,
//     products
//   });
// });

// // Get Products for Admin
// const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
//   // Example logic: Retrieve all products for admin
//   const products = await productsModel.getAllProducts();
//   res.status(200).json({
//     success: true,
//     products
//   });
// });

// // Get Product Details
// const getProductDetails = catchAsyncErrors(async (req, res, next) => {
//   const product = await productsModel.getProductById(req.params.id);
//   if (!product) {
//     return next(new ErrorHandler('Product not found', 404));
//   }
//   res.status(200).json({
//     success: true,
//     product
//   });
// });

// // Update Product
// const updateProduct = catchAsyncErrors(async (req, res, next) => {
//   upload.single('snapshot')(req, res, async (err) => {
//     if (err) {
//       return next(new ErrorHandler(err.message, 400));
//     }

//     const { name, product_category, description, price, ratings } = req.body;
//     const snapshot = req.file ? req.file.path : null;

//     const updatedProduct = await productsModel.updateProduct(req.params.id, { name, product_category, description, snapshot, price, ratings });
//     if (!updatedProduct) {
//       return next(new ErrorHandler('Product not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       product: updatedProduct
//     });
//   });
// });

// // Delete Product
// const deleteProduct = catchAsyncErrors(async (req, res, next) => {
//   const product = await productsModel.getProductById(req.params.id);
//   if (!product) {
//     return next(new ErrorHandler('Product not found', 404));
//   }

//   await productsModel.deleteProduct(req.params.id);
//   res.status(200).json({
//     success: true,
//     message: 'Product deleted successfully'
//   });
// });

// // Create Product Review
// const createProductReview = catchAsyncErrors(async (req, res, next) => {
//   const { product_id, user_id, review_text, rating } = req.body;
//   const review = await productsModel.createProductReview({ product_id, user_id, review_text, rating });
//   res.status(201).json({
//     success: true,
//     review
//   });
// });

// // Get Product Reviews
// const getProductReviews = catchAsyncErrors(async (req, res, next) => {
//   const reviews = await productsModel.getProductReviews(req.params.product_id);
//   res.status(200).json({
//     success: true,
//     reviews
//   });
// });

// // Delete Review
// const deleteReview = catchAsyncErrors(async (req, res, next) => {
//   await productsModel.deleteReview(req.params.id);
//   res.status(200).json({
//     success: true,
//     message: 'Review deleted successfully'
//   });
// });

// module.exports = {
//   addProduct,
//   getAllProducts,
//   getAdminProducts,
//   getProductDetails,
//   updateProduct,
//   deleteProduct,
//   createProductReview,
//   getProductReviews,
//   deleteReview
// };
