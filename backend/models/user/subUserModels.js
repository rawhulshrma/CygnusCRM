const pool = require('../../config/db');
const bcrypt = require('bcryptjs'); // Require bcrypt for hashing passwords

const createSubUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS subusers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      profile VARCHAR(255)
    );
  `
  await pool.query(query);
};

const getAllSubUsers = async () => {
  try {
    const result = await pool.query('SELECT id, name, email, profile FROM subusers');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all subusers:', error);
    throw error;
  }
};

const getSubUserById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, email, profile FROM subusers WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching subuser with ID ${id}:`, error);
    throw error;
  }
};


const getSubUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM subusers WHERE email = $1', [email]);
  return result.rows[0];
};
const createSubUser = async (subUser) => {
  const { name, email, password, profile } = subUser;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const result = await pool.query(
      'INSERT INTO subusers (name, email, password, profile) VALUES ($1, $2, $3, $4) RETURNING id, name, email, profile',
      [name, email, hashedPassword, profile]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating subuser:', error);
    throw error;
  }
};

const updateSubUser = async (id, subUser) => {
  const { name, email, password, profile } = subUser;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password if updating
    const result = await pool.query(
      'UPDATE subusers SET name = $1, email = $2, password = $3, profile = $4 WHERE id = $5 RETURNING id, name, email, profile',
      [name, email, hashedPassword, profile, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating subuser:', error);
    throw error;
  }
};


const updateSubUserProfile = async (id, profilePath) => {
  try {
    const result = await pool.query(
      'UPDATE subusers SET profile = $1 WHERE id = $2 RETURNING id, name, email, profile',
      [profilePath, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating subuser profile:', error);
    throw error;
  }
}

const deleteSubUser = async (id) => {
  try {
    await pool.query('DELETE FROM subusers WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting subuser:', error);
    throw error;
  }
};

module.exports = {
  createSubUserTable,
  getAllSubUsers,
  getSubUserById,
  createSubUser,
  updateSubUser,
  getSubUserByEmail,
  updateSubUserProfile,
  deleteSubUser,
};
