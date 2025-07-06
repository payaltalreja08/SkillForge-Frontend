const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment');

const MONGO_URI = 'mongodb://localhost:27017/skillforge'; // Change if needed

const domains = ['Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cloud Computing', 'UI/UX', 'Cybersecurity'];
const levels = ['beginner', 'intermediate', 'advanced'];
const categories = ['Programming', 'Data Science', 'Design', 'Cloud', 'AI/ML', 'Web', 'Mobile'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFromArray(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

const thumbnailFiles = [
  'jsEssential.jpg',
  'pythonDataAnalysis.png',
  'mongodb.jpg',
  'mlCrashCourse.webp',
  'react.jpg',
  'uiux.jpg',
  'System design.png'
];
const videoFiles = [
  'mongodb.mp4',
  'react.mp4',
  'dataAnlysis.mp4',
  'jsEssential.mp4',
  'ml.mp4'
];

function getRandomThumbnail() {
  return `/uploads/${getRandomFromArray(thumbnailFiles)}`;
}
function getRandomVideo() {
  return `/uploads/videos/${getRandomFromArray(videoFiles)}`;
}
function getDomainFromTitle(title) {
  if (/react/i.test(title)) return 'Web Development';
  if (/node|js/i.test(title)) return 'Web Development';
  if (/python|data/i.test(title)) return 'Data Science';
  if (/ml|machine/i.test(title)) return 'AI/ML';
  if (/uiux|design/i.test(title)) return 'UI/UX';
  if (/mongo/i.test(title)) return 'Data Science';
  return getRandomFromArray(domains);
}
function getCourseContext(title) {
  return `This course, "${title}", provides a comprehensive introduction and hands-on experience in ${getDomainFromTitle(title)}. You'll learn practical skills and build real-world projects to master the subject.`;
}
function getVideoDescription(title, domain) {
  return `This video covers the topic: ${title}, which is essential for understanding ${domain}.`;
}
function getVideoContext(title, domain) {
  return `Gain a deep understanding of ${title} in the context of ${domain}. This lesson prepares you for advanced concepts and practical application.`;
}

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Clear existing data
  await User.deleteMany({});
  await Course.deleteMany({});
  await Feedback.deleteMany({});
  await Comment.deleteMany({});

  // Dummy names, emails, domains, etc.
  const instructorNames = [
    'Sahil Mehta', 'James Wilson', 'Emily Clark', 'Amit Patel', 'Sophia Lee',
    'David Kim', 'Priya Singh', 'John Carter', 'Olivia Brown', 'Liam Smith',
    'Emma Johnson', 'Noah Williams', 'Ava Martinez', 'Mia Davis', 'Lucas Miller',
    'Charlotte Garcia', 'Benjamin Rodriguez', 'Elijah Martinez', 'Amelia Hernandez', 'Mason Lopez',
    'Zara Patel', 'Ethan Clark', 'Harper Lee', 'Logan Young', 'Layla Scott',
    'Jack Turner', 'Grace Evans', 'Henry Walker', 'Ella King', 'Sebastian Wright',
    'Chloe Baker', 'Alexander Green', 'Penelope Adams', 'Matthew Nelson', 'Scarlett Hill',
    'Daniel Rivera', 'Victoria Campbell', 'Samuel Mitchell', 'Lily Carter', 'Julian Perez'
  ];
  const studentNames = [
    'Priya Sharma', 'Rahul Verma', 'Ananya Gupta', 'Rohan Das', 'Sneha Kapoor',
    'Vikram Singh', 'Sara Ali', 'Kabir Khan', 'Aarav Joshi', 'Meera Nair',
    'Ishaan Roy', 'Tara Mehta', 'Arjun Sethi', 'Diya Shah', 'Yash Malhotra',
    'Simran Kaur', 'Karan Gill', 'Neha Bhatia', 'Ayaan Sheikh', 'Riya Chawla',
    'Aditi Rao', 'Dev Sharma', 'Nisha Jain', 'Rajat Kapoor', 'Tanvi Sinha',
    'Manav Mehra', 'Pooja Reddy', 'Siddharth Rao', 'Rhea Sen', 'Aditya Chauhan',
    'Manya Singh', 'Rudra Patel', 'Saanvi Joshi', 'Aryan Gupta', 'Navya Nair',
    'Vivaan Shah', 'Kiara Mehta', 'Dhruv Bansal', 'Anvi Sharma', 'Parth Desai',
    'Aarohi Shah', 'Reyansh Singh', 'Myra Kapoor', 'Kabir Jain', 'Aanya Sethi',
    'Advait Reddy', 'Ira Malhotra', 'Arnav Verma', 'Aisha Khan', 'Vihaan Das',
    'Shanaya Roy', 'Krishna Patel', 'Tanishq Sharma', 'Prisha Nair', 'Yuvraj Singh',
    'Aarav Kapoor', 'Ishika Mehra', 'Arjun Reddy', 'Anaya Sharma', 'Atharv Joshi'
  ];
  const courseTitles = [
    'React for Beginners', 'Advanced Node.js', 'Python Data Science', 'Machine Learning 101', 'UI/UX Design Bootcamp',
    'Android App Development', 'iOS Swift Mastery', 'AWS Cloud Essentials', 'Cybersecurity Basics', 'Vue.js Crash Course',
    'Django Web Apps', 'Flutter Mobile Apps', 'JavaScript Algorithms', 'HTML & CSS Mastery', 'SQL for Everyone',
    'Kotlin for Android', 'Express.js Deep Dive', 'TensorFlow for Starters', 'Figma for Designers', 'DevOps Fundamentals',
    'PHP for Web', 'Ruby on Rails', 'C# for Beginners', 'Go Programming', 'Rust Essentials',
    'Scala Bootcamp', 'Perl Scripting', 'TypeScript Mastery', 'Angular in Depth', 'Bootstrap 5 Crash',
    'SASS & CSS Tricks', 'Next.js Guide', 'Nuxt.js for Vue', 'GraphQL Basics', 'Redux Essentials',
    'Jest Testing', 'Mocha & Chai', 'Jenkins CI/CD', 'Docker for Devs', 'Kubernetes 101'
  ];
  const courseDescriptions = [
    'Learn from scratch and build modern apps.',
    'Master advanced concepts and real-world projects.',
    'Hands-on labs and practical exercises.',
    'Step-by-step guide for beginners.',
    'Industry best practices and tips.'
  ];

  const defaultProfileImage = '/uploads/default-profile.png';

  // 1. Instructors
  const instructors = await User.insertMany(
    instructorNames.map((name, i) => ({
      name,
      email: `instructor${i + 1}@skillforge.com`,
      password: 'hashedpassword',
      role: 'instructor',
      profileImage: defaultProfileImage,
      domain: getRandomFromArray(domains),
      experience: getRandomInt(2, 10),
      joinedOn: new Date(2020, getRandomInt(0, 11), getRandomInt(1, 28)),
    }))
  );

  // 2. Students
  const students = await User.insertMany(
    studentNames.map((name, i) => ({
      name,
      email: `student${i + 1}@skillforge.com`,
      password: 'hashedpassword',
      role: 'student',
      profileImage: defaultProfileImage,
      joinedOn: new Date(2021, getRandomInt(0, 11), getRandomInt(1, 28)),
      streak: getRandomInt(0, 30),
      progress: {},
      enrolledCourses: []
    }))
  );

  // 3. Courses (with modules, videos, quizzes)
  const courses = await Course.insertMany(
    courseTitles.map((title, i) => {
      const instructor = getRandomFromArray(instructors);
      const domain = getDomainFromTitle(title);
      const modules = Array.from({ length: getRandomInt(2, 3) }, (_, mIdx) => ({
        title: `${title} - Module ${mIdx + 1}`,
        duration: getRandomInt(30, 120), // duration in minutes
        videos: Array.from({ length: getRandomInt(2, 4) }, (_, vIdx) => {
          const vtitle = `${title} Video ${vIdx + 1}`;
          return {
            title: vtitle,
            url: getRandomVideo(),
            description: getVideoDescription(vtitle, domain),
            context: getVideoContext(vtitle, domain)
          };
        }),
        quizzes: [
          {
            title: `${title} Quiz ${mIdx + 1}`,
            question: `What is the main topic of ${title}?`, // required field
            options: [
              'Web Development',
              'Mobile Development',
              'Data Science',
              'Other'
            ],
            correctAnswer: getRandomInt(0, 3), // required field
            questions: [
              {
                question: `Who is the instructor for this module?`,
                options: instructorNames.slice(0, 4),
                answer: getRandomInt(0, 3)
              }
            ]
          }
        ]
      }));
      return {
        name: title,
        description: getRandomFromArray(courseDescriptions),
        context: getCourseContext(title),
        instructorName: instructor.name,
        instructor: instructor._id,
        price: getRandomInt(20, 150),
        duration: getRandomInt(10, 40),
        studentsEnrolled: getRandomInt(100, 10000),
        rating: (Math.random() * 2 + 3).toFixed(1),
        thumbnail: getRandomThumbnail(),
        level: getRandomFromArray(levels),
        category: getRandomFromArray(categories),
        modules
      };
    })
  );

  // 4. Feedback
  const feedbacks = [];
  const usedCombinations = new Set();
  
  for (let i = 0; i < 60; i++) {
    let courseId, userId, combination;
    
    // Ensure unique courseId-userId combination
    do {
      courseId = getRandomFromArray(courses)._id;
      userId = getRandomFromArray(students)._id;
      combination = `${courseId}-${userId}`;
    } while (usedCombinations.has(combination));
    
    usedCombinations.add(combination);
    
    feedbacks.push({
      courseId,
      userId,
      rating: getRandomInt(3, 5),
      review: `This course was ${getRandomFromArray(['amazing', 'helpful', 'good', 'okay', 'challenging'])}!`,
      createdAt: new Date(2023, getRandomInt(0, 11), getRandomInt(1, 28)),
    });
  }
  await Feedback.insertMany(feedbacks);

  // 5. Comments
  const comments = [];
  for (let i = 0; i < 60; i++) {
    comments.push({
      courseId: getRandomFromArray(courses)._id,
      userId: getRandomFromArray(students)._id,
      moduleIndex: getRandomInt(0, 2),
      videoIndex: getRandomInt(0, 3),
      text: `Can you explain more about ${getRandomFromArray(['hooks', 'state', 'props', 'components', 'deployment'])}?`,
      createdAt: new Date(2023, getRandomInt(0, 11), getRandomInt(1, 28)),
    });
  }
  await Comment.insertMany(comments);

  console.log('Dummy data seeded!');
  process.exit();
}

seed(); 