const pool = require('../../config/db');

// Function to create the productsCategory table
const createProductCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS productsCategory (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description VARCHAR(100) NOT NULL,
      color VARCHAR(100) NOT NULL
    );
  `;
  await pool.query(query);
};

// Function to get all product categories
const getAllProductsCategory = async () => {
  try {
    const result = await pool.query('SELECT id, name, description, color FROM productsCategory');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all Product Categories:', error);
    throw error;
  }
};

// Function to get a product category by ID
const getProductsCategoryById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, description, color FROM productsCategory WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching productsCategory with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new product category
const createProductsCategory = async (productsCategory) => {
  const { name, description, color } = productsCategory;
  try {
    const result = await pool.query(
      'INSERT INTO productsCategory (name, description, color) VALUES ($1, $2, $3) RETURNING id, name, description, color',
      [name, description, color]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating productsCategory:', error);
    throw error;
  }
};

// Function to update a product category
const updateProductsCategory = async (id, productsCategory) => {
  const { name, description, color } = productsCategory;
  try {
    const result = await pool.query(
      'UPDATE productsCategory SET name = $1, description = $2, color = $3 WHERE id = $4 RETURNING id, name, description, color',
      [name, description, color, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating productsCategory:', error);
    throw error;
  }
};

// Function to delete a product category
const deleteProductsCategory = async (id) => {
  try {
    await pool.query('DELETE FROM productsCategory WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting productsCategory:', error);
    throw error;
  }
};

// Get Total Product Categories Count
const getTotalProductsCategoryCount = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS count FROM productsCategory');
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching total product categories count:', error);
    throw error;
  }
};

// Get Products Category Query (for API feature usage)
const getProductsCategoryQuery = () => {
  return pool.query('SELECT * FROM productsCategory');
};

module.exports = {
  createProductCategoryTable,
  getAllProductsCategory,
  getProductsCategoryById,
  createProductsCategory,
  updateProductsCategory,
  deleteProductsCategory,
  getTotalProductsCategoryCount,
  getProductsCategoryQuery
};
