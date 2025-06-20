import React, { useState, useEffect } from 'react';
import { Star, Users, Clock, Award, BookOpen, Play, ShoppingCart, Check } from 'lucide-react';

const SkillForge = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);

  // Sample course data
  const courses = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Sarah Johnson",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.8,
      students: 12543,
      duration: "24 hours",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      description: "Master React with hooks, context, and advanced patterns. Build production-ready applications with modern React techniques.",
      modules: ["React Hooks", "Context API", "Performance Optimization", "Testing", "State Management"]
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "David Chen",
      price: 79.99,
      originalPrice: 119.99,
      rating: 4.9,
      students: 8921,
      duration: "18 hours",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      description: "Learn design thinking, user research, and create stunning interfaces that users love.",
      modules: ["Design Thinking", "User Research", "Prototyping", "Visual Design", "Usability Testing"]
    },
    {
      id: 3,
      title: "Python for Data Science",
      instructor: "Dr. Maria Rodriguez",
      price: 94.99,
      originalPrice: 149.99,
      rating: 4.7,
      students: 15678,
      duration: "32 hours",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
      description: "Comprehensive Python course covering data analysis, visualization, and machine learning fundamentals.",
      modules: ["Python Basics", "Pandas & NumPy", "Data Visualization", "Machine Learning", "Real Projects"]
    },
    {
      id: 4,
      title: "Digital Marketing Strategy",
      instructor: "Alex Thompson",
      price: 69.99,
      originalPrice: 99.99,
      rating: 4.6,
      students: 9834,
      duration: "20 hours",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      description: "Build comprehensive digital marketing strategies that drive growth and engagement.",
      modules: ["SEO & SEM", "Social Media", "Content Marketing", "Analytics", "Campaign Management"]
    },
    {
      id: 5,
      title: "Mobile App Development",
      instructor: "James Wilson",
      price: 99.99,
      originalPrice: 149.99,
      rating: 4.8,
      students: 7654,
      duration: "28 hours",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      description: "Create native mobile apps for iOS and Android using React Native and modern development practices.",
      modules: ["React Native", "Navigation", "API Integration", "State Management", "App Store Deployment"]
    },
    {
      id: 6,
      title: "Cybersecurity Fundamentals",
      instructor: "Dr. Emily Carter",
      price: 84.99,
      originalPrice: 124.99,
      rating: 4.7,
      students: 6543,
      duration: "25 hours",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
      description: "Learn essential cybersecurity concepts, threat detection, and protection strategies.",
      modules: ["Network Security", "Ethical Hacking", "Risk Assessment", "Incident Response", "Compliance"]
    }
  ];

  const getRandomCourses = (excludeId) => {
    const filtered = courses.filter(course => course.id !== excludeId);
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const [randomCourses, setRandomCourses] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      setRandomCourses(getRandomCourses(selectedCourse.id));
    }
  }, [selectedCourse]);

  const buyCourse = (courseId) => {
    if (!purchasedCourses.includes(courseId)) {
      setPurchasedCourses([...purchasedCourses, courseId]);
    }
  };

  const Navbar = () => (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Award className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SkillForge
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('courses')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'courses' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Courses
              </button>
              <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </button>
              <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-indigo-600 font-medium">Sign In</button>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const HeroSection = () => (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Master New Skills with
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                SkillForge
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Learn from industry experts and transform your career with our comprehensive online courses. 
              Join thousands of learners who've already upgraded their skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCurrentPage('courses')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Courses
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-1 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                alt="Learning Experience" 
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const FeatureSection = () => (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SkillForge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide the best learning experience with cutting-edge technology and expert instructors
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <BookOpen className="h-8 w-8" />,
              title: "Expert Instructors",
              description: "Learn from industry professionals with years of real-world experience"
            },
            {
              icon: <Play className="h-8 w-8" />,
              title: "Interactive Content",
              description: "Engage with hands-on projects and interactive video lessons"
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: "Community Support",
              description: "Join a thriving community of learners and get help when you need it"
            },
            {
              icon: <Award className="h-8 w-8" />,
              title: "Certificates",
              description: "Earn recognized certificates to showcase your new skills to employers"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-xl w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Award className="h-8 w-8 text-indigo-400 mr-2" />
              <span className="font-bold text-xl">SkillForge</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering learners worldwide with high-quality online education and professional development.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Courses</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Science</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SkillForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  const CourseCard = ({ course, onClick }) => (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden"
      onClick={() => onClick(course)}
    >
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
          ${course.price}
        </div>
        {course.originalPrice > course.price && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Save ${(course.originalPrice - course.price).toFixed(2)}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">by {course.instructor}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold text-gray-700">{course.rating}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="h-4 w-4 mr-1" />
            {course.students.toLocaleString()}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}
          </div>
        </div>
        {course.originalPrice > course.price && (
          <div className="text-sm text-gray-500 line-through mb-2">
            Original: ${course.originalPrice}
          </div>
        )}
      </div>
    </div>
  );

  const CoursesPage = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive selection of courses designed to advance your career
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onClick={(course) => {
                setSelectedCourse(course);
                setCurrentPage('course-detail');
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const CourseDetailPage = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => setCurrentPage('courses')}
          className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Courses
        </button>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <img 
              src={selectedCourse.image} 
              alt={selectedCourse.title}
              className="w-full h-64 object-cover rounded-2xl mb-8"
            />
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedCourse.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{selectedCourse.description}</p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">{selectedCourse.rating}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-1" />
                {selectedCourse.students.toLocaleString()} students
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-1" />
                {selectedCourse.duration}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
              <div className="space-y-4">
                {selectedCourse.modules.map((module, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{module}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  ${selectedCourse.price}
                </div>
                {selectedCourse.originalPrice > selectedCourse.price && (
                  <div className="text-lg text-gray-500 line-through">
                    ${selectedCourse.originalPrice}
                  </div>
                )}
              </div>
              
              {purchasedCourses.includes(selectedCourse.id) ? (
                <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-semibold mb-4">
                  <Check className="h-5 w-5 inline mr-2" />
                  Course Purchased!
                </div>
              ) : (
                <button 
                  onClick={() => buyCourse(selectedCourse.id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 mb-4"
                >
                  <ShoppingCart className="h-5 w-5 inline mr-2" />
                  Buy Now
                </button>
              )}
              
              <p className="text-sm text-gray-600 text-center mb-6">
                Instructor: <span className="font-semibold text-gray-900">{selectedCourse.instructor}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {randomCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onClick={(course) => {
                  setSelectedCourse(course);
                  window.scrollTo(0, 0);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <>
      <HeroSection />
      <FeatureSection />
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'courses' && <CoursesPage />}
      {currentPage === 'course-detail' && selectedCourse && <CourseDetailPage />}
      <Footer />
    </div>
  );
};

export default SkillForge;