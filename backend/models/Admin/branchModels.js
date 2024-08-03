const pool = require('../../config/db');
const moment = require('moment'); // For date formatting

// Create the Branch table
const createBranchTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS branch (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL,
      color VARCHAR(50),
      created_at VARCHAR(10) DEFAULT TO_CHAR(CURRENT_DATE, 'DD-MM-YYYY')
    );
  `;
  await pool.query(query);
};

// Get all braanch
const getAllBranch = async () => {
  try {
    const result = await pool.query('SELECT id, name, address, city, country, color, created_at FROM branch');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all branch:', error);
    throw error;
  }
};

// Get branch details by ID
const getBranchById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, address, city, country, color, created_at FROM branch WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching branch with ID ${id}:`, error);
    throw error;
  }
};

// Create a new branch
const createBranch = async (branch) => {
  const { name, address, city, country, color } = branch;
  try {
    const formattedDate = moment().format('DD-MM-YYYY'); // Format date as DD-MM-YYYY
    const result = await pool.query(
      'INSERT INTO branch (name, address, city, country, color, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, address, city, country, color, created_at',
      [name, address, city, country, color, formattedDate]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

// Update an existing branch
const updateBranch = async (id, branch) => {
  const { name, address, city, country, color } = branch;
  try {
    let updateQuery = 'UPDATE branch SET ';
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateQuery += `name = $${paramCount}, `;
      updateValues.push(name);
      paramCount++;
    }
    if (address !== undefined) {
      updateQuery += `address = $${paramCount}, `;
      updateValues.push(address);
      paramCount++;
    }
    if (city !== undefined) {
      updateQuery += `city = $${paramCount}, `;
      updateValues.push(city);
      paramCount++;
    }
    if (country !== undefined) {
      updateQuery += `country = $${paramCount}, `;
      updateValues.push(country);
      paramCount++;
    }
    if (color !== undefined) {
      updateQuery += `color = $${paramCount}, `;
      updateValues.push(color);
      paramCount++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, address, city, country, color, created_at`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Branch not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

// Delete a branch by ID
const deleteBranch = async (id) => {
  try {
    await pool.query('DELETE FROM branch WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting branch:', error);
    throw error;
  }
};

module.exports = {
  createBranchTable,
  getAllBranch,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
