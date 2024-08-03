const pool = require('../../config/db');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT
const moment = require('moment'); // For date formatting

// Create the users table with a default role of 'admin' and created_at as VARCHAR
const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (    
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      profile VARCHAR(255),
      role VARCHAR(50) DEFAULT 'admin',
      created_at VARCHAR(10) DEFAULT TO_CHAR(CURRENT_DATE, 'DD-MM-YYYY')  -- VARCHAR to store formatted date
    );
  `;
  await pool.query(query);
};

// Get all users
const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT id, name, email, profile, role, created_at FROM users');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};


const getUserDetails = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, profile, role, created_at FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Get a user by ID
const getUserById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, email, profile, role, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Get a user by email
const getUserByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

// Create a new user with a default role of 'admin'
const createUser = async (user) => {
  const { name, email, password, profile } = user;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const formattedDate = moment().format('DD-MM-YYYY'); // Format date as DD-MM-YYYY
    const result = await pool.query(
      'INSERT INTO users (name, email, password, profile, role, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, profile, role, created_at',
      [name, email, hashedPassword, profile, 'admin', formattedDate] // Include formatted date
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update an existing user
const updateUser = async (id, user) => {
  const { name, email, password, profile } = user;
  try {
    let updateQuery = 'UPDATE users SET ';
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateQuery += `name = $${paramCount}, `;
      updateValues.push(name);
      paramCount++;
    }
    if (email !== undefined) {
      updateQuery += `email = $${paramCount}, `;
      updateValues.push(email);
      paramCount++;
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += `password = $${paramCount}, `;
      updateValues.push(hashedPassword);
      paramCount++;
    }
    if (profile !== undefined) {
      updateQuery += `profile = $${paramCount}, `;
      updateValues.push(profile);
      paramCount++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, email, profile, role, created_at`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Update a user's profile
const updateUserProfile = async (id, profilePath) => {
  try {
    const result = await pool.query(
      'UPDATE users SET profile = $1 WHERE id = $2 RETURNING id, name, email, profile, role, created_at',
      [profilePath, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Delete a user by ID
const deleteUser = async (id) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Generate a JWT token
const getJWTToken = (user) => {
  const { id, name, email, role } = user;
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE });  // Make sure this is a valid string or number
};

// Compare hashed password with plain text password
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

module.exports = {
  createUserTable,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  getUserByEmail,
  updateUserProfile,
  deleteUser,
  getJWTToken,
  getUserDetails,
  comparePassword,
};


// createUserTable,
// getAllUsers,
// getUserById,
// createUser,
// updateUser,
// getUserByEmail,
// updateUserProfile,
// deleteUser,
// getJWTToken,
// getUserDetails,
// comparePassword,