const Course = require('../models/Course');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const sampleCourses = [
  {
    name: "Advanced React Development",
    description: "Master React with hooks, context, and advanced patterns. Build production-ready applications with modern React techniques.",
    price: 89.99,
    duration: 24,
    category: "Web Development",
    level: "advanced",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    modules: [
      {
        title: "React Hooks Deep Dive",
        topics: ["useState", "useEffect", "useContext", "useReducer", "Custom Hooks"],
        duration: 180
      },
      {
        title: "Context API & State Management",
        topics: ["Context API", "Redux", "Zustand", "State Patterns"],
        duration: 240
      },
      {
        title: "Performance Optimization",
        topics: ["React.memo", "useMemo", "useCallback", "Code Splitting"],
        duration: 200
      },
      {
        title: "Testing React Applications",
        topics: ["Jest", "React Testing Library", "Unit Testing", "Integration Testing"],
        duration: 160
      }
    ],
    rating: 4.8,
    studentsEnrolled: 12543,
    ratingDistribution: { 1: 50, 2: 100, 3: 300, 4: 2000, 5: 10093 }
  },
  {
    name: "UI/UX Design Masterclass",
    description: "Learn design thinking, user research, and create stunning interfaces that users love.",
    price: 79.99,
    duration: 18,
    category: "Design",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    modules: [
      {
        title: "Design Thinking Fundamentals",
        topics: ["Empathy", "Define", "Ideate", "Prototype", "Test"],
        duration: 120
      },
      {
        title: "User Research Methods",
        topics: ["Interviews", "Surveys", "Usability Testing", "Analytics"],
        duration: 150
      },
      {
        title: "Prototyping & Wireframing",
        topics: ["Figma", "Sketch", "Adobe XD", "Interactive Prototypes"],
        duration: 180
      },
      {
        title: "Visual Design Principles",
        topics: ["Typography", "Color Theory", "Layout", "Visual Hierarchy"],
        duration: 200
      }
    ],
    rating: 4.9,
    studentsEnrolled: 8921,
    ratingDistribution: { 1: 30, 2: 60, 3: 150, 4: 1500, 5: 7181 }
  },
  {
    name: "Python for Data Science",
    description: "Comprehensive Python course covering data analysis, visualization, and machine learning fundamentals.",
    price: 94.99,
    duration: 32,
    category: "Data Science",
    level: "beginner",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
    modules: [
      {
        title: "Python Basics",
        topics: ["Variables", "Data Types", "Control Flow", "Functions", "Classes"],
        duration: 240
      },
      {
        title: "Pandas & NumPy",
        topics: ["Data Manipulation", "Data Cleaning", "Statistical Analysis"],
        duration: 300
      },
      {
        title: "Data Visualization",
        topics: ["Matplotlib", "Seaborn", "Plotly", "Interactive Charts"],
        duration: 200
      },
      {
        title: "Machine Learning Fundamentals",
        topics: ["Scikit-learn", "Supervised Learning", "Unsupervised Learning"],
        duration: 280
      }
    ],
    rating: 4.7,
    studentsEnrolled: 15678,
    ratingDistribution: { 1: 80, 2: 150, 3: 400, 4: 2500, 5: 12548 }
  },
  {
    name: "Digital Marketing Strategy",
    description: "Build comprehensive digital marketing strategies that drive growth and engagement.",
    price: 69.99,
    duration: 20,
    category: "Marketing",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    modules: [
      {
        title: "SEO & SEM Fundamentals",
        topics: ["Keyword Research", "On-Page SEO", "Google Ads", "Bing Ads"],
        duration: 180
      },
      {
        title: "Social Media Marketing",
        topics: ["Facebook", "Instagram", "LinkedIn", "Twitter", "Content Strategy"],
        duration: 200
      },
      {
        title: "Content Marketing",
        topics: ["Blog Writing", "Video Content", "Email Marketing", "Lead Magnets"],
        duration: 160
      },
      {
        title: "Analytics & Campaign Management",
        topics: ["Google Analytics", "Facebook Pixel", "Conversion Tracking"],
        duration: 140
      }
    ],
    rating: 4.6,
    studentsEnrolled: 9834,
    ratingDistribution: { 1: 60, 2: 120, 3: 300, 4: 1800, 5: 7554 }
  },
  {
    name: "Mobile App Development",
    description: "Create native mobile apps for iOS and Android using React Native and modern development practices.",
    price: 99.99,
    duration: 28,
    category: "Mobile Development",
    level: "advanced",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    modules: [
      {
        title: "React Native Fundamentals",
        topics: ["Components", "Navigation", "State Management", "Styling"],
        duration: 240
      },
      {
        title: "Advanced Navigation",
        topics: ["Stack Navigator", "Tab Navigator", "Drawer Navigator"],
        duration: 180
      },
      {
        title: "API Integration",
        topics: ["REST APIs", "GraphQL", "Authentication", "Error Handling"],
        duration: 200
      },
      {
        title: "App Store Deployment",
        topics: ["iOS App Store", "Google Play Store", "App Signing", "Release Process"],
        duration: 160
      }
    ],
    rating: 4.8,
    studentsEnrolled: 7654,
    ratingDistribution: { 1: 40, 2: 80, 3: 200, 4: 1200, 5: 6134 }
  },
  {
    name: "Cybersecurity Fundamentals",
    description: "Learn essential cybersecurity concepts, threat detection, and protection strategies.",
    price: 84.99,
    duration: 25,
    category: "Cybersecurity",
    level: "beginner",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    modules: [
      {
        title: "Network Security",
        topics: ["Network Protocols", "Firewalls", "VPNs", "Network Monitoring"],
        duration: 200
      },
      {
        title: "Ethical Hacking",
        topics: ["Penetration Testing", "Vulnerability Assessment", "Security Tools"],
        duration: 220
      },
      {
        title: "Risk Assessment",
        topics: ["Threat Modeling", "Risk Analysis", "Security Policies"],
        duration: 180
      },
      {
        title: "Incident Response",
        topics: ["Security Incidents", "Forensics", "Recovery Procedures"],
        duration: 160
      }
    ],
    rating: 4.7,
    studentsEnrolled: 6543,
    ratingDistribution: { 1: 35, 2: 70, 3: 180, 4: 1000, 5: 5258 }
  }
];

const seedCourses = async () => {
  try {
    // First, create some instructor users
    const instructorUsers = [
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        password: "password123",
        role: "instructor",
        domain: "Web Development",
        experience: 8
      },
      {
        name: "David Chen",
        email: "david.chen@example.com",
        password: "password123",
        role: "instructor",
        domain: "UI/UX Design",
        experience: 6
      },
      {
        name: "Dr. Maria Rodriguez",
        email: "maria.rodriguez@example.com",
        password: "password123",
        role: "instructor",
        domain: "Data Science",
        experience: 10
      },
      {
        name: "Alex Thompson",
        email: "alex.thompson@example.com",
        password: "password123",
        role: "instructor",
        domain: "Digital Marketing",
        experience: 7
      },
      {
        name: "James Wilson",
        email: "james.wilson@example.com",
        password: "password123",
        role: "instructor",
        domain: "Mobile Development",
        experience: 9
      },
      {
        name: "Dr. Emily Carter",
        email: "emily.carter@example.com",
        password: "password123",
        role: "instructor",
        domain: "Cybersecurity",
        experience: 12
      }
    ];

    // Create instructor users
    const createdInstructors = [];
    for (const instructorData of instructorUsers) {
      const existingUser = await User.findOne({ email: instructorData.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(instructorData.password, 10);
        const instructor = await User.create({
          ...instructorData,
          password: hashedPassword
        });
        createdInstructors.push(instructor);
      } else {
        createdInstructors.push(existingUser);
      }
    }

    // Clear existing courses
    await Course.deleteMany({});

    // Create courses with instructor references
    const coursesWithInstructors = sampleCourses.map((course, index) => ({
      ...course,
      instructor: createdInstructors[index]._id,
      instructorName: createdInstructors[index].name
    }));

    await Course.insertMany(coursesWithInstructors);

    console.log('✅ Courses seeded successfully!');
    console.log(`Created ${coursesWithInstructors.length} courses`);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  }
};

module.exports = { seedCourses }; 