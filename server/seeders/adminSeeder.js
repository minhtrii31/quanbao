const User = require('../models/User');

const validatePassword = (password) => {
  return typeof password === 'string' &&
    password.length >= 10 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);
};

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Admin Quan Bao';

    if (!email || !password) {
      console.log('Skipping admin seed: ADMIN_EMAIL and ADMIN_PASSWORD are required');
      return;
    }

    if (!validatePassword(password)) {
      console.log('Skipping admin seed: ADMIN_PASSWORD must be at least 10 characters and include uppercase, lowercase, and a number');
      return;
    }

    // Check if admin exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new User({
      email,
      password,
      name
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log(`Email: ${email}`);
  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
};

module.exports = createAdmin;
