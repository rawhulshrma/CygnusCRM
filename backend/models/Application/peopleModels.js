const pool = require('../../config/db'); // Adjust the path as needed
const bcrypt = require('bcryptjs'); // For hashing passwords

// Create the people table
const createPeopleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS people (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      company VARCHAR(100),
      country VARCHAR(50) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255) NOT NULL, -- Added password field
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// Get a person by email
const getPersonByEmail = async (email) => {
    try {
      const result = await pool.query('SELECT id, name, company, country, phone, email, password, created_at FROM people WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      console.error(`Error fetching person by email ${email}:`, error);
      throw error;
    }
  };
  
// Get all people
const getAllPeople = async () => {
    const query = 'SELECT * FROM people';
    const { rows } = await pool.query(query);
    return rows;
};;

// Get a person by ID
const getPeopleById = async (id) => {
    try {
      const result = await pool.query('SELECT id, name, company, country, phone, email, created_at FROM people WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error(`Error fetching person with ID ${id}:`, error);
      throw error;
    }
  };

// Create a new person
const createPerson = async (person) => {
    const { name, company, country, phone, email, password } = person;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO people (name, company, country, phone, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, company, country, phone, email, created_at',
        [name, company, country, phone, email, hashedPassword]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating person:', error);
      throw error;
    }
  }

// Update an existing person
const updatePerson = async (id, person) => {
  const { name, company, country, phone, email, password } = person;
  try {
    let updateQuery = 'UPDATE people SET ';
    const updateValues = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateQuery += `name = $${paramCount}, `;
      updateValues.push(name);
      paramCount++;
    }
    if (company !== undefined) {
      updateQuery += `company = $${paramCount}, `;
      updateValues.push(company);
      paramCount++;
    }
    if (country !== undefined) {
      updateQuery += `country = $${paramCount}, `;
      updateValues.push(country);
      paramCount++;
    }
    if (phone !== undefined) {
      updateQuery += `phone = $${paramCount}, `;
      updateValues.push(phone);
      paramCount++;
    }
    if (email !== undefined) {
      updateQuery += `email = $${paramCount}, `;
      updateValues.push(email);
      paramCount++;
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      updateQuery += `password = $${paramCount}, `;
      updateValues.push(hashedPassword);
      paramCount++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, company, country, phone, email, created_at`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      throw new Error('Person not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating person:', error);
    throw error;
  }
};

// Delete a person by ID
const deletePerson = async (id) => {
  try {
    await pool.query('DELETE FROM people WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;
  }
};

module.exports = {
  createPeopleTable,
  getAllPeople,
  getPeopleById,
  getPersonByEmail ,
  createPerson,
  updatePerson,
  deletePerson,
};
