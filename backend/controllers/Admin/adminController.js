const AdminModel = require('../../models/Admin/adminModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwtToken');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/admin');
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
  }
});

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
}).single('avatar');

// Create a new admin
const createAdmin = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler('File upload error', 500));
    }

    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.path : null;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const formattedDate = moment().format('DD-MM-YYYY');
      const result = await AdminModel.createAdmin({
        name,
        email,
        password: hashedPassword,
        avatar,
        role: 'admin',
        created_at: formattedDate
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error('Error creating admin:', error);
      next(new ErrorHandler('Error creating admin', 500));
    }
  });
};

// Login admin
const loginAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please Provide Email & Password', 400));
  }

  const admin = await AdminModel.getAdminByEmail(email);
  if (!admin) {
    return next(new ErrorHandler('Invalid Email & Password', 401));
  }

  const isMatch = await AdminModel.comparePassword(password, admin.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid Email & Password', 401));
  }

  // Send token and response using sendToken
  sendToken(admin, 200, res); // No need to send another response here
});

// Get admin details
const getAdminDetails = catchAsyncErrors(async (req, res, next) => {
  const adminId = req.admin.id;
  try {
    const result = await AdminModel.getAdminDetails(adminId);
    if (!result) {
      return next(new ErrorHandler('Admin not found', 404));
    }
    res.status(200).json({ success: true, admin: result });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    next(new ErrorHandler('Error fetching admin details', 500));
  }
});


// Update admin profile
const updateAdminProfile = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler('File upload error', 500));
    }

    const adminId = req.admin.id;
    const { name, email, password } = req.body;
    const newAvatar = req.file ? req.file.path : null;

    try {
      // Get the current admin data
      const currentAdmin = await AdminModel.getAdminById(adminId);

      // If there's a new avatar, delete the old one
      if (currentAdmin.avatar && newAvatar) {
        const oldAvatarPath = path.join(__dirname, '..', '..', 'uploads', 'admin', path.basename(currentAdmin.avatar));

        try {
          await fs.unlink(oldAvatarPath);
        } catch (unlinkErr) {
          if (unlinkErr.code !== 'ENOENT') {
            // Only log the error if it's not due to the file not existing
            console.error('Error deleting old avatar:', unlinkErr);
            return next(new ErrorHandler('Error deleting old avatar', 500));
          }
        }
      }

      // Update the admin profile
      const updatedAdmin = await AdminModel.updateAdmin(adminId, {
        name,
        email,
        password,
        avatar: newAvatar || currentAdmin.avatar
      });

      res.status(200).json({ success: true, data: updatedAdmin });
    } catch (error) {
      console.error('Error updating admin profile:', error);
      next(new ErrorHandler('Error updating admin profile', 500));
    }
  });
};

const logoutAdmin = (req, res, next) => {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    next(new ErrorHandler('Error logging out', 500));
  }
};

// Export all controllers
module.exports = {
  createAdmin,
  loginAdmin,
  getAdminDetails,
  updateAdminProfile,
  logoutAdmin
};
