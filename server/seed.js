require('dotenv').config();
const connectDB = require('./config/db');
const createAdmin = require('./seeders/adminSeeder');
const seedServices = require('./seeders/serviceSeeder');

const seedDatabase = async () => {
  try {
    await connectDB();
    await createAdmin();
    await seedServices();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
