const jwt = require('jsonwebtoken');
const AdminModel = require('../models/Admin/adminModels');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const isAuthenticatedAdmin = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new ErrorHandler('Please login to access this resource', 401));
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminModel.getAdminById(decodedData.id);
    if (!admin) {
      return next(new ErrorHandler('Admin not found', 404));
    }
    req.admin = admin;
    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid or expired token', 401));
  }
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      console.log('Access Denied:', req.admin); // Debugging line
      return next(new ErrorHandler('Access Denied', 403));
    }
    next();
  };
};


module.exports = { isAuthenticatedAdmin, authorizeRoles };
