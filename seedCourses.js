require('dotenv').config();
const connectDB = require('./config/db');
const { seedCourses } = require('./seeders/courseSeeder');

const runSeeder = async () => {
  try {
    await connectDB();
    await seedCourses();
    process.exit(0);
  } catch (error) {
    console.error('Error running seeder:', error);
    process.exit(1);
  }
};

runSeeder(); 