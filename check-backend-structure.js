const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'server.js',
  'routes/courseRoutes.js',
  'routes/userRoutes.js',
  'routes/instructorRoutes.js',
  'routes/aiRoutes.js',
  'controllers/aiController.js',
  'controllers/commentController.js',
  'controllers/feedbackController.js',
  'controllers/certificateController.js',
  'controllers/courseController.js',
  'middleware/auth.js',
  '.env'
];

console.log('--- Backend Structure Check ---');
let allGood = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found: ${file}`);
  } else {
    console.log(`❌ MISSING: ${file}`);
    allGood = false;
  }
});

// Check for GEMINI_API_KEY in .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  if (envContent.includes('GEMINI_API_KEY=')) {
    console.log('✅ GEMINI_API_KEY found in .env');
  } else {
    console.log('❌ GEMINI_API_KEY NOT FOUND in .env');
    allGood = false;
  }
}

if (allGood) {
  console.log('🎉 All required files and keys are present!');
} else {
  console.log('⚠️  Some files or keys are missing. Please fix the above issues.');
}