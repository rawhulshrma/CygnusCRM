const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create Admin Table
const createAdminTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar VARCHAR(255),
      role VARCHAR(50) DEFAULT 'admin',
      created_at VARCHAR(10) DEFAULT TO_CHAR(CURRENT_DATE, 'DD-MM-YYYY')
    );
  `;
  try {
    await pool.query(query);
  } catch (error) {
    console.error('Error creating Admin table:', error);
    throw error;
  }
};

// Get Admin by Email
const getAdminByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching Admin by email:', error);
    throw error;
  }
};

// Get All Admins
const getAllAdmins = async () => {
  try {
    const result = await pool.query('SELECT id, name, email, avatar, role, created_at FROM admin');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all Admins:', error);
    throw error;
  }
};

// Get Admin Details
const getAdminDetails = async (adminId) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar, role, created_at FROM admin WHERE id = $1',
      [adminId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching Admin details:', error);
    throw error;
  }
};


// Get a user by ID
const getAdminById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, email,avatar, role, created_at FROM admin WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching Admin with ID ${id}:`, error);
    throw error;
  }
};





// Update Admin
const updateAdmin = async (id, admin) => {
  const { name, email, password, avatar } = admin;
  try {
    let updateQuery = 'UPDATE admin SET ';
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
    if (avatar !== undefined) {
      updateQuery += `avatar = $${paramCount}, `;
      updateValues.push(avatar);
      paramCount++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, email, avatar, role, created_at`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Admin not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating Admin:', error);
    throw error;
  }
};

// Generate JWT Token
const getJWTToken = (admin) => {
  const { id, name, email, role } = admin;
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Compare Password
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

module.exports = {
  createAdminTable,
  getAdminByEmail,
  getAllAdmins,
  getAdminDetails,
  updateAdmin,
  getJWTToken,
  getAdminById,
  comparePassword
};


// const pool = require('../../config/db'); // Adjust path if necessary
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// // Create Admin Table
// const createAdminTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS admin (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(100) NOT NULL,
//       email VARCHAR(100) NOT NULL UNIQUE,
//       password TEXT NOT NULL,
//       avatar VARCHAR(255),
//       role VARCHAR(50) DEFAULT 'admin',
//       created_at VARCHAR(10) DEFAULT TO_CHAR(CURRENT_DATE, 'DD-MM-YYYY')
//     );
//   `;
//   try {
//     await pool.query(query);
//   } catch (error) {
//     console.error('Error creating Admin table:', error);
//     throw error;
//   }
// };

// // Get Admin by Email
// const getAdminByEmail = async (email) => {
//   try {
//     const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
//     return result.rows[0];
//   } catch (error) {
//     console.error('Error fetching Admin by email:', error);
//     throw error;
//   }
// };

// // Get All Admins
// const getAllAdmin = async () => {
//   try {
//     const result = await pool.query('SELECT id, name, email, avatar, role, created_at FROM admin');
//     return result.rows;
//   } catch (error) {
//     console.error('Error fetching all Admins:', error);
//     throw error;
//   }
// };

// // Get Admin Details
// const getAdminDetails = async (adminId) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, name, email, avatar, role, created_at FROM admin WHERE id = $1',
//       [adminId]
//     );
//     return result.rows[0];
//   } catch (error) {
//     console.error('Error fetching Admin details:', error);
//     throw error;
//   }
// };

// // Get Admin by ID
// const getAdminById = async (id) => {
//   try {
//     const result = await pool.query('SELECT id, name, email, avatar, role, created_at FROM admin WHERE id = $1', [id]);
//     return result.rows[0];
//   } catch (error) {
//     console.error(`Error fetching Admin with ID ${id}:`, error);
//     throw error;
//   }
// };

// // Update Admin
// const updateAdmin = async (id, admin) => {
//   const { name, email, password, avatar } = admin;
//   try {
//     let updateQuery = 'UPDATE admin SET ';
//     const updateValues = [];
//     let paramCount = 1;

//     if (name !== undefined) {
//       updateQuery += `name = $${paramCount}, `;
//       updateValues.push(name);
//       paramCount++;
//     }
//     if (email !== undefined) {
//       updateQuery += `email = $${paramCount}, `;
//       updateValues.push(email);
//       paramCount++;
//     }
//     if (password !== undefined) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateQuery += `password = $${paramCount}, `;
//       updateValues.push(hashedPassword);
//       paramCount++;
//     }
//     if (avatar !== undefined) {
//       updateQuery += `avatar = $${paramCount}, `;
//       updateValues.push(avatar);
//       paramCount++;
//     }

//     // Remove trailing comma and space
//     updateQuery = updateQuery.slice(0, -2);

//     updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, email, avatar, role, created_at`;
//     updateValues.push(id);

//     const result = await pool.query(updateQuery, updateValues);

//     if (result.rows.length === 0) {
//       throw new Error('Admin not found');
//     }

//     return result.rows[0];
//   } catch (error) {
//     console.error('Error updating Admin:', error);
//     throw error;
//   }
// };

// // Generate JWT Token
// const getJWTToken = (admin) => {
//   const { id, name, email, role } = admin;
//   return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
// };

// // Compare Password
// const comparePassword = async (plainPassword, hashedPassword) => {
//   try {
//     return await bcrypt.compare(plainPassword, hashedPassword);
//   } catch (error) {
//     console.error('Error comparing passwords:', error);
//     throw error;
//   }
// };

// module.exports = {
//   createAdminTable,
//   getAdminByEmail,
//   getAllAdmin,
//   getAdminDetails,
//   getAdminById,
//   updateAdmin,
//   getJWTToken,
//   comparePassword
// };
