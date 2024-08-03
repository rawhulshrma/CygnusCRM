const PeopleModel = require('../../models/Application/peopleModels');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwtToken');
const bcrypt = require('bcryptjs');

// Get all people
const getAllPeople = catchAsyncErrors(async (req, res, next) => {
    const people = await PeopleModel.getAllPeople();
    res.status(200).json({
      success: true,
      data: people
    });
});
// Get a person by ID
const getPeopleById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const person = await PeopleModel.getPersonById(id);
  if (!person) {
    return next(new ErrorHandler('Person not found', 404));
  }
  res.status(200).json(person);
});

// Add a new person
// Add a new person
const addPeople = catchAsyncErrors(async (req, res, next) => {
    const { name, company, country, phone, email, password } = req.body;
  
    // Check if person already exists
    const existingPerson = await PeopleModel.getPersonByEmail(email);
    if (existingPerson) {
      return next(new ErrorHandler('Person already exists', 400));
    }
  
    // Create new person (password will be hashed in the model)
    const newPerson = await PeopleModel.createPerson({
      name,
      company,
      country,
      phone,
      email,
      password,
    });
  
    res.status(201).json({
      success: true,
      message: 'Person created successfully',
      person: newPerson,
    });
  });
  
  // Login
// controllers/Application/peopleController.js

const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(new ErrorHandler('Please provide email and password', 400));
    }
  
    const person = await PeopleModel.getPersonByEmail(email);
    if (!person) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }
  
    const isMatch = await bcrypt.compare(password, person.password);
    if (!isMatch) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }
  
    // Send token and user details in response
    sendToken(person, 200, res);
  });
  

// Get details of a person
const getPeopleDetails = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // ID will be fetched from the URL parameter
    console.log('Fetching details for ID:', id); // Debugging line
    const people = await PeopleModel.getPeopleById(id);
    if (!people) {
      return next(new ErrorHandler('Person not found', 404));
    }
    res.status(200).json({
      success: true,
      data: people
    });
});
// Update a person's profile
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, company, country, phone, email, password } = req.body;

  // If password is being updated, hash the new password
  let updateData = { name, company, country, phone, email };
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedPerson = await PeopleModel.updatePerson(id, updateData);
  if (!updatedPerson) {
    return next(new ErrorHandler('Person not found', 404));
  }
  res.status(200).json(updatedPerson);
});

// Get a person by email
const getUserByEmail = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.params;
  const person = await PeopleModel.getPersonByEmail(email);
  if (!person) {
    return next(new ErrorHandler('Person not found', 404));
  }
  res.status(200).json(person);
});


  
// Logout
const logout = catchAsyncErrors(async (req, res, next) => {
  // In a real application, you'd invalidate the token here
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = {
  getAllPeople,
  getPeopleById,
  addPeople,
  getPeopleDetails,
  updateProfile,
  getUserByEmail,
  login,
  logout,
};
