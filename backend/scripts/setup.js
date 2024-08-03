

const { createAdminTable, getAdminByEmail } = require('../models/Admin/adminModels');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const initialAdmin = {
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  avatar: process.env.ADMIN_AVATAR,
};

const setup = async () => {
  try {
    await createAdminTable();

    // Check if admin already exists
    const existingAdmin = await getAdminByEmail(initialAdmin.email);
    if (existingAdmin) {
      console.log('Admin already created');
      return;
    }

    const hashedPassword = await bcrypt.hash(initialAdmin.password, 10);
    const formattedDate = moment().format('DD-MM-YYYY');
    const query = `
      INSERT INTO admin (name, email, password, avatar, role, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, [initialAdmin.name, initialAdmin.email, hashedPassword, initialAdmin.avatar, 'admin', formattedDate]);
    console.log('Initial Admin Created');
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    pool.end();
  }
};

setup();
