const express = require('express');
const router = express.Router();
const branchController = require('../../controllers/Admin/branchController');
const { isAuthenticatedAdmin, authorizeRoles } = require('../../middleware/auth');

// Create a new branch
router.post('/', isAuthenticatedAdmin, authorizeRoles("admin"), branchController.createBranch);

// Get all branches
router.get('/', isAuthenticatedAdmin, authorizeRoles("admin"), branchController.getAllBranch);

// Get branch by ID
router.get('/:id', isAuthenticatedAdmin, authorizeRoles("admin"), branchController.getBranchById);

// Update a branch
router.put('/:id', isAuthenticatedAdmin, authorizeRoles("admin"), branchController.updateBranch);

// Delete a branch
router.delete('/:id', isAuthenticatedAdmin, authorizeRoles("admin"), branchController.deleteBranch);

module.exports = router;


