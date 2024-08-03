const express = require('express');
const router = express.Router();
const productsCategoryController = require('../../controllers/products/productsCategoryController');

router.get('/', productsCategoryController.getAllProductCategory );
router.post('/',productsCategoryController.addProductCategory);
// router.get('/:id', productsCategoryController.getProductsCategoryById);
// router.put('/:id', productsCategoryController.updateProductsCategory);
// router.delete('/:id',productsCategoryController.removeProductsCategory);

module.exports = router;