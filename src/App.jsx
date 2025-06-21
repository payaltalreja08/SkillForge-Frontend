import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import CoursesPage from './components/CoursesPage';
import CourseDetailPage from './components/CourseDetailPage';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { CourseData } from './components/CourseData';

const App = () => {
  // Main app state
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [authForm, setAuthForm] = useState({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const [authErrors, setAuthErrors] = useState({});
const [showPassword, setShowPassword] = useState(false);

const handleInputChange = (field, value) => {
  setAuthForm((prev) => ({ ...prev, [field]: value }));
};

// Form validation (basic version)
const validateForm = () => {
  const errors = {};
  if (authMode === 'register') {
    if (!authForm.fullName) errors.fullName = 'Full name is required';
    if (authForm.password !== authForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  if (!authForm.email) errors.email = 'Email is required';
  if (!authForm.password) errors.password = 'Password is required';
  return errors;
};

// Handle form submission
const handleAuthSubmit = () => {
  const errors = validateForm();
  setAuthErrors(errors);
  if (Object.keys(errors).length === 0) {
    // Simulate user auth success
    handleAuthSuccess({ name: authForm.fullName || 'User', email: authForm.email });

    // Reset form
    setAuthForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    setAuthErrors({});
  }
};

  // Handle course purchase
  const handleBuyCourse = (courseId) => {
    if (!isLoggedIn) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    if (!purchasedCourses.includes(courseId)) {
      setPurchasedCourses([...purchasedCourses, courseId]);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPurchasedCourses([]);
  };

  // Handle successful authentication
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setCurrentPage('course-detail');
  };

  // Navigate back to courses
  const handleBackToCourses = () => {
    setCurrentPage('courses');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowAuth={setShowAuthModal}
        onSetAuthMode={setAuthMode}
      />
      
      {currentPage === 'home' && (
        <>
          <HeroSection onExploreClick={() => setCurrentPage('courses')} />
          <FeatureSection />
        </>
      )}
      
      {currentPage === 'courses' && (
        <CoursesPage 
          courses={CourseData}
          onCourseSelect={handleCourseSelect}
        />
      )}
      
      {currentPage === 'course-detail' && selectedCourse && (
        <CourseDetailPage 
          course={selectedCourse}
          courses={CourseData}
          isPurchased={purchasedCourses.includes(selectedCourse.id)}
          isLoggedIn={isLoggedIn}
          onBuyCourse={handleBuyCourse}
          onBackToCourses={handleBackToCourses}
          onCourseSelect={handleCourseSelect}
        />
      )}
      
      <Footer />
      
  {showAuthModal && (
  <AuthModal 
    showAuthModal={showAuthModal}
    setShowAuthModal={setShowAuthModal}
    authMode={authMode}
    setAuthMode={setAuthMode}
    authForm={authForm}
    setAuthForm={setAuthForm}
    authErrors={authErrors}
    setAuthErrors={setAuthErrors}
    showPassword={showPassword}
    setShowPassword={setShowPassword}
    handleAuthSubmit={handleAuthSubmit}
    handleInputChange={handleInputChange}
  />
)}

    </div>
  );
};

export default App;