// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const pool = require('./config/db');
// const productCategoryRoutes = require('./routes/product/productCategoryRoutes');
// const peopleRoutes = require('./routes/Application/peopleRoutes');
// const productRoutes = require('./routes/product/productsRoutes');
// const userRoutes = require('./routes/user/userRoutes');
// const adminRoutes = require('./routes/Admin/adminRoutes');
// const branchRoutes = require('./routes/Admin/branchRoutes'); // Add this line
// const productCategoryModel = require('./models/products/productCategoryModel');
// const productModel = require('./models/products/productsModel');
// const adminModel = require('./models/Admin/adminModels');
// const UserModel = require('./models/user/UserModels');
// const peopleModels = require('./models/Application/peopleModels'); 
// const branchModel = require('./models/Admin/branchModels'); // Add this line
// const errorMiddleware = require('./middleware/error');
// const app = express();
// const PORT = process.env.PORT || 3000; // Set a default port for development

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(cookieParser());

// // Default route
// app.get('/', (req, res) => {
//   res.send('Welcome to CRM Database API');
// });

// app.use('/uploads', express.static('uploads'));

// // Routes
// app.use('/api/v1/admin', adminRoutes);
// app.use('/api/v1/people', peopleRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/category/product', productCategoryRoutes);
// app.use('/api/v1/product', productRoutes);
// app.use('/api/v1/branch', branchRoutes); // Add this line

// // Middleware to handle errors
// app.use(errorMiddleware);

// // Initialize database tables
// const initializeTables = async () => {
//   try {
//     await UserModel.createUserTable();
//     await peopleModels.createPeopleTable();
//     await adminModel.createAdminTable();
//     await productCategoryModel.createProductCategoryTable();
//     await productModel.createProductsTable();
//     await branchModel.createBranchTable(); // Add this line
//     console.log('Database Tables Initialized Successfully');
//   } catch (err) {
//     console.error('Error Initializing Tables:', err.message);
//     process.exit(1);
//   }
// };

// // Error handling for 404 routes
// app.use('*', (req, res) => {
//   res.status(404).send('Not Found');
// });

// // Database connection and server start
// const startServer = async () => {
//   try {
//     await pool.query('SELECT NOW()');
//     console.log('Database connection successful');
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error('Database connection error:', err.message);
//     process.exit(1);
//   }
// };

// // Start initialization and server
// initializeTables().then(startServer);

// module.exports = app;


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const pool = require('./config/db');
const productCategoryRoutes = require('./routes/product/productCategoryRoutes');
const peopleRoutes = require('./routes/Application/peopleRoutes');
const productRoutes = require('./routes/product/productsRoutes');
const userRoutes = require('./routes/user/userRoutes');
const adminRoutes = require('./routes/Admin/adminRoutes');
const branchRoutes = require('./routes/Admin/branchRoutes'); // Added route for branches
const productCategoryModel = require('./models/products/productCategoryModel');
const productModel = require('./models/products/productsModel');
const adminModel = require('./models/Admin/adminModels');
const UserModel = require('./models/user/UserModels');
const peopleModels = require('./models/Application/peopleModels'); 
const branchModel = require('./models/Admin/branchModels'); // Added model for branches
const errorMiddleware = require('./middleware/error');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to CRM Database API');
});

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/people', peopleRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/category/product', productCategoryRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/branch', branchRoutes); // Added route for branches

// Middleware to handle errors
app.use(errorMiddleware);

// Initialize database tables
const initializeTables = async () => {
  try {
    await UserModel.createUserTable();
    await peopleModels.createPeopleTable();
    await adminModel.createAdminTable();
    await productCategoryModel.createProductCategoryTable();
    await productModel.createProductsTable();
    await branchModel.createBranchTable(); // Added table initialization for branches
    console.log('Database Tables Initialized Successfully');
  } catch (err) {
    console.error('Error Initializing Tables:', err.message);
    process.exit(1);
  }
};

// Error handling for 404 routes
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Database connection and server start
const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// Start initialization and server
initializeTables().then(startServer);

module.exports = app;
