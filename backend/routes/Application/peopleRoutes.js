const express = require('express');
const router = express.Router();
const peopleController = require('../../controllers/Application/peopleController');
const { isAuthenticatedAdmin, authorizeRoles } = require('../../middleware/auth');

// Admin Routes
router.post('/', isAuthenticatedAdmin, authorizeRoles('admin'), peopleController.addPeople);
router.post('/login', peopleController.login);
router.get('/logout', peopleController.logout);
router.get('/', isAuthenticatedAdmin, authorizeRoles('admin'), peopleController.getAllPeople);
router.get('/:id', isAuthenticatedAdmin, authorizeRoles('admin'), peopleController.getPeopleDetails);

module.exports = router;



module.exports = router;

// // User Routes
// router.post('/', userController.addUser);
// router.put('/me/update', isAuthenticatedAdmin, userController.updateProfile);

// // Admin Routes
// router.get('/admin/users', isAuthenticatedAdmin, authorizeRoles('admin'), userController.getAllUsers);

// router.route('/admin/user/:id')
//   .get(isAuthenticatedAdmin, authorizeRoles('admin'), userController.getSingleUser)   // GET request to fetch user by ID
//   .put(isAuthenticatedAdmin, authorizeRoles('admin'), userController.updateUserRole)  // PUT request to update user role
//   .delete(isAuthenticatedAdmin, authorizeRoles('admin'), userController.deleteUser);  // DELETE request to delete user


