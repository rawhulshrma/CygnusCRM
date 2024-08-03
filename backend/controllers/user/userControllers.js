const UserModel = require('../../models/user/UserModels');
const SubUserModel = require('../../models/user/subUserModels');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwtToken');
const bcrypt = require('bcryptjs');
// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/users');
  },
  filename: function (req, file, cb) {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  }
});

// Configure Multer file filters
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
// Create User
const addUser = catchAsyncErrors(async (req, res, next) => {
  upload.single('profile')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 400));
    }

    const { name, email, password } = req.body;
    let profile = req.file ? req.file.path : null;

    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Delete uploaded file if user already exists
      }
      return next(new ErrorHandler('Email already exists, please use a different email', 400));
    }

    const newUser = await UserModel.createUser({ name, email, password, profile });
    sendToken(newUser, 201, res); // Send token
  });
});

// Login User
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  // Check if user exists by email
  const user = await UserModel.getUserByEmail(email);
  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Send JWT token
  sendToken(user, 200, res);
});

// Get User Details 
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming req.user is set by your authentication middleware
    
    const user = await UserModel.getUserDetails(userId);
    
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }
    
    // Send user details
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    return next(new ErrorHandler('Error fetching user details', 500));
  }
});



// Get User by Email
const getUserByEmail = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.params;
  const user = await UserModel.getUserByEmail(email);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  res.status(200).json(user);
});

// Get All Users
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await UserModel.getAllUsers();
  res.status(200).json(users);
});

// Get User by ID
const getUserById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.getUserById(id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  res.status(200).json(user);
});

// Update User
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  upload.single('profile')(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 400));
    }

    const userId = req.user.id; // Make sure this matches how you set the user in your auth middleware
    const { name, email, currentPassword, newPassword } = req.body;
    let newProfilePath = req.file ? req.file.path : undefined;

    try {
      const existingUser = await UserModel.getUserById(userId);
      
      if (!existingUser) {
        if (newProfilePath) {
          fs.unlinkSync(newProfilePath);
        }
        return next(new ErrorHandler('User not found', 404));
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (newProfilePath) updateData.profile = newProfilePath;

      // Handle password change
      if (currentPassword && newPassword) {
        const isPasswordCorrect = await UserModel.comparePassword(currentPassword, existingUser.password);
        if (!isPasswordCorrect) {
          if (newProfilePath) {
            fs.unlinkSync(newProfilePath);
          }
          return next(new ErrorHandler('Current password is incorrect', 400));
        }
        updateData.password = newPassword; // The model will hash this
      }

      const updatedUser = await UserModel.updateUser(userId, updateData);

      // Delete old profile picture if it exists and a new one was uploaded
      if (newProfilePath && existingUser.profile) {
        fs.unlink(existingUser.profile, (err) => {
          if (err) console.error('Error deleting old profile picture:', err);
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          profile: updatedUser.profile,
          role: updatedUser.role,
          created_at: updatedUser.created_at
        }
      });
    } catch (error) {
      if (newProfilePath) {
        fs.unlink(newProfilePath, (err) => {
          if (err) console.error('Error deleting new profile picture:', err);
        });
      }
      if (error.message === 'User not found') {
        return next(new ErrorHandler('User not found', 404));
      }
      return next(new ErrorHandler('Error updating profile', 500));
    }
  });
});


const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = await SubUserModel.getUserById(id);
  
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      created_at: user.created_at
    }
  });
});


const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  // Validate role
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    return next(new ErrorHandler('Invalid role', 400));
  }

  const updatedUser = await UserModel.updateUser(id, { role });

  if (!updatedUser) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    user: updatedUser
  });
});

// Delete User
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const deletedUser = await UserModel.deleteUser(id);

  if (!deletedUser) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (deletedUser.profile) {
    fs.unlink(deletedUser.profile, (err) => {
      if (err) console.error('Error deleting profile picture:', err);
    });
  }

  res.status(204).end();
});

// Logout
const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { expires: new Date(0), httpOnly: true })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  getUserDetails,
  updateProfile,
  getUserByEmail,
  deleteUser,
  getSingleUser,
  updateUserRole,
  loginUser,
  logout,
};
