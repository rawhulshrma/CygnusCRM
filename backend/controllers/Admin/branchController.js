const branchModel = require('../../models/Admin/branchModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');

// Create a new branch
const createBranch = catchAsyncErrors(async (req, res, next) => {
  const newBranch = await branchModel.createBranch(req.body);
  res.status(201).json({
    success: true,
    branch: newBranch
  });
});

// Get all branches
const getAllBranch = catchAsyncErrors(async (req, res, next) => {
  const branches = await branchModel.getAllBranch();
  res.status(200).json({
    success: true,
    branches
  });
});

// Get branch by ID
const getBranchById = catchAsyncErrors(async (req, res, next) => {
  const branch = await branchModel.getBranchById(req.params.id);
  if (!branch) {
    return next(new ErrorHandler('Branch not found', 404));
  }

  res.status(200).json({
    success: true,
    branch
  });
});

// Update a branch
const updateBranch = catchAsyncErrors(async (req, res, next) => {
  const updatedBranch = await branchModel.updateBranch(req.params.id, req.body);
  if (!updatedBranch) {
    return next(new ErrorHandler('Branch not found', 404));
  }

  res.status(200).json({
    success: true,
    branch: updatedBranch
  });
});

// Delete a branch
const deleteBranch = catchAsyncErrors(async (req, res, next) => {
  const deletedBranch = await branchModel.deleteBranch(req.params.id);
  if (!deletedBranch) {
    return next(new ErrorHandler('Branch not found', 404));
  }
  
  res.status(200).json({
    success: true,
    message: 'Branch deleted successfully'
  });
});

module.exports = {
  createBranch,
  getAllBranch,
  getBranchById,
  updateBranch,
  deleteBranch
};