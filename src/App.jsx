import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import CoursesPage from './components/CoursesPage';
import CourseDetailPage from './components/CourseDetailPage';
import CourseManagement from './components/CourseManagement';
import CoursePlayer from './components/CoursePlayer';
import UserDashboard from './components/UserDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CourseAnalytics from './components/CourseAnalytics';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import AboutUsPage from './components/AboutUsPage';

// API base URL
const API_BASE_URL = 'http://localhost:5000';

const App = () => {
  // Main app state
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [analyticsCourseId, setAnalyticsCourseId] = useState(null);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Dashboard refs for refresh functionality
  const userDashboardRef = useRef();
  const instructorDashboardRef = useRef();

  // Course state
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Default role
    learnerType: '',
    degree: '',
    jobType: '',
    domain: '',
    experience: ''
  });
  const [authErrors, setAuthErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  // Validate token and restore session
  const validateToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  // Check for existing token on app load
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          // Validate token with backend
          const user = await validateToken(token);
          if (user) {
            setIsLoggedIn(true);
            setCurrentUser(user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setIsLoggedIn(false);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Session restoration error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      }
    };

    restoreSession();
  }, []);

  // Add this useEffect to handle OAuth token in URL
  useEffect(() => {
    // Check for token in URL (after OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('authToken', token);
      
      fetch('http://localhost:5000/api/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
          }
          // Clean up the URL
          urlParams.delete('token');
          const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
          window.history.replaceState({}, document.title, newUrl);
          // Reload to trigger session restore
          window.location.reload();
        });
    }
  }, []);

 
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        setCourses(data.courses || data); // Handle both paginated and non-paginated responses
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCoursesError('Failed to load courses. Please try again later.');
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  
  const fetchCourseById = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
      const course = await response.json();
      return course;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  };

  const handleInputChange = (field, value) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
    // Clear specific field error when user starts typing
    if (authErrors[field]) {
      setAuthErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  
  const validateForm = () => {
    const errors = {};
    
    if (authMode === 'register') {
      if (!authForm.fullName.trim()) {
        errors.fullName = 'Full name is required';
      }
      if (authForm.password !== authForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (authForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      // Role validation
      if (!authForm.role) {
        errors.role = 'Please select a role';
      }
      
      // Student-specific validation
      if (authForm.role === 'student') {
        if (!authForm.learnerType) {
          errors.learnerType = 'Please select your learner type';
        }
      }
      
      // Instructor-specific validation
      if (authForm.role === 'instructor') {
        if (!authForm.domain) {
          errors.domain = 'Please enter your domain of expertise';
        }
        if (!authForm.experience || authForm.experience < 0) {
          errors.experience = 'Please enter your years of experience';
        }
      }
    }
    
    if (!authForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(authForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!authForm.password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };

  // API call functions
  const registerUser = async (userData) => {
    const requestBody = {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    };

    // Add role-specific fields
    if (userData.role === 'student') {
      requestBody.learnerType = userData.learnerType;
      requestBody.degree = userData.degree || '';
      requestBody.jobType = userData.jobType || '';
    } else if (userData.role === 'instructor') {
      requestBody.domain = userData.domain;
      requestBody.experience = parseInt(userData.experience) || 0;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  };

  const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  };

  // Handle form submission
  const handleAuthSubmit = async () => {
    const errors = validateForm();
    setAuthErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      
      try {
        let result;
        
        if (authMode === 'register') {
          result = await registerUser(authForm);
        } else {
          result = await loginUser(authForm);
        }
        
        // Handle successful authentication
        handleAuthSuccess(result);
        
        // Reset form
        setAuthForm({ 
          fullName: '', 
          email: '', 
          password: '', 
          confirmPassword: '', 
          role: 'student',
          learnerType: '',
          degree: '',
          jobType: '',
          domain: '',
          experience: ''
        });
        setAuthErrors({});
        
      } catch (error) {
        console.error('Auth error:', error);
        setAuthErrors({ 
          general: error.message || 'Authentication failed. Please try again.' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/oauth/google`;
  };

  // Handle continue course from dashboard
  const handleContinueCourse = (courseId) => {
    setCurrentCourseId(courseId);
    setCurrentPage('course-player');
  };

  // Handle course purchase
  const handleBuyCourse = async (courseId) => {
    if (!isLoggedIn) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/courses/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        const data = await response.json();
        showToast('Course purchased successfully!', 'success');
        
        // Refresh dashboard to show updated enrollment data
        refreshDashboard();
        // Refresh instructor dashboard as well
        if (instructorDashboardRef.current) {
          instructorDashboardRef.current.refresh();
        }
        
        // Update enrolled courses list
        if (!enrolledCourses.includes(courseId)) {
          setEnrolledCourses([...enrolledCourses, courseId]);
        }
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to purchase course', 'error');
      }
    } catch (error) {
      console.error('Error purchasing course:', error);
      showToast('Failed to purchase course. Please try again.', 'error');
    }
  };

  // Check if user is enrolled in a course
  const checkEnrollment = async (courseId) => {
    if (!isLoggedIn) return false;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/courses/enrollment/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.isEnrolled;
      }
      return false;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
  };

  // Fetch user's enrolled courses from backend
  const fetchUserEnrollments = async () => {
    if (!isLoggedIn) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const enrolledCourseIds = data.enrolledCourses.map(course => course._id);
        setEnrolledCourses(enrolledCourseIds);
      }
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
    }
  };

  // Fetch user enrollments when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserEnrollments();
    }
  }, [isLoggedIn]);

  // Refresh dashboard data
  const refreshDashboard = () => {
    if (currentUser?.role === 'instructor' && instructorDashboardRef.current) {
      instructorDashboardRef.current.refresh();
    } else if (currentUser?.role === 'student' && userDashboardRef.current) {
      userDashboardRef.current.refresh();
    }
  };

  // Handle course player navigation
  const handleStartCourse = (courseId) => {
    if (!isLoggedIn) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    if (!enrolledCourses.includes(courseId)) {
      alert('Please purchase this course first.');
      return;
    }
    setCurrentCourseId(courseId);
    setCurrentPage('course-player');
  };

  // Handle back from course player
  const handleBackFromPlayer = () => {
    setCurrentPage('courses');
    setCurrentCourseId(null);
  };

  const handleFeedbackSubmitted = () => {
    // Refresh instructor dashboard if user is an instructor
    if (currentUser?.role === 'instructor' && instructorDashboardRef.current) {
      instructorDashboardRef.current.refresh();
    }
    // Refresh courses to update ratings
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || data);
        }
      } catch (error) {
        console.error('Error refreshing courses:', error);
      }
    };
    fetchCourses();
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEnrolledCourses([]);
    setSelectedCourse(null);
    setCurrentPage('home'); // Redirect to home page after logout
  };

  // Handle successful authentication
  const handleAuthSuccess = async (authData) => {
    const { token, user } = authData;
    
    // Store token
    localStorage.setItem('authToken', token);
    
    try {
      // Fetch fresh user data from backend
      const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const dashboardData = await response.json();
        
        // Store fresh user data
        localStorage.setItem('userData', JSON.stringify(dashboardData.user));
        
        setCurrentUser(dashboardData.user);
        setIsLoggedIn(true);
        setShowAuthModal(false);
        
        // Fetch user enrollments
        const enrolledCourseIds = dashboardData.enrolledCourses.map(course => course._id);
        setEnrolledCourses(enrolledCourseIds);
        
        showToast('Login successful!', 'success');
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching fresh user data:', error);
      // Fallback to login response data
      localStorage.setItem('userData', JSON.stringify(user));
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowAuthModal(false);
    }
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    // Map backend data structure to frontend expectations
    const courseData = {
      id: course._id,
      title: course.name,
      instructor: course.instructorName || (course.instructor?.name || 'Unknown Instructor'),
      price: course.price,
      originalPrice: course.price * 1.3, // Calculate original price for display
      rating: course.rating,
      students: course.studentsEnrolled,
      duration: `${course.duration} hours`,
      image: course.thumbnail,
      description: course.description,
      modules: course.modules || [] // Preserve full module structure with videos
    };
    
    setSelectedCourse(courseData);
    setCurrentPage('course-detail');
  };

  // Navigate back to courses
  const handleBackToCourses = () => {
    setCurrentPage('courses');
  };

  // Handle dashboard navigation
  const handleShowDashboard = () => {
    if (!isLoggedIn) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    setCurrentPage('dashboard');
  };

  // Handle analytics navigation
  const handleShowAnalytics = (courseId) => {
    setAnalyticsCourseId(courseId);
    setCurrentPage('course-analytics');
  };

  // Handle back from analytics
  const handleBackFromAnalytics = () => {
    setCurrentPage('dashboard');
    setAnalyticsCourseId(null);
  };

  // Persist currentPage and selectedCourse in localStorage
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
    if (selectedCourse) {
      localStorage.setItem('selectedCourse', JSON.stringify(selectedCourse));
    } else {
      localStorage.removeItem('selectedCourse');
    }
  }, [currentPage, selectedCourse]);

  // Restore currentPage and selectedCourse on app load
  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    const savedCourse = localStorage.getItem('selectedCourse');
    if (savedPage) setCurrentPage(savedPage);
    if (savedCourse) setSelectedCourse(JSON.parse(savedCourse));
  }, []);

  return (
    <>
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowAuth={setShowAuthModal}
        onSetAuthMode={setAuthMode}
        onShowDashboard={handleShowDashboard}
      />
      {currentPage === 'home' && (
        <>
          <HeroSection onExploreClick={() => window.location.href='/courses'} />
          <FeatureSection />
        </>
      )}
      {currentPage === 'courses' && (
        <CoursesPage 
          courses={courses}
          onCourseSelect={handleCourseSelect}
          onStartCourse={handleStartCourse}
          enrolledCourses={enrolledCourses}
          loading={coursesLoading}
          error={coursesError}
        />
      )}
      {currentPage === 'course-detail' && (
        <CourseDetailPage 
          course={selectedCourse}
          courses={courses}
          isPurchased={selectedCourse && enrolledCourses.includes(selectedCourse.id)}
          isLoggedIn={isLoggedIn}
          onBuyCourse={handleBuyCourse}
          onStartCourse={handleStartCourse}
          onBackToCourses={handleBackToCourses}
          onCourseSelect={handleCourseSelect}
        />
      )}
      {currentPage === 'course-management' && (
        <CourseManagement 
          currentUser={currentUser}
          onBackToCourses={() => window.location.href='/courses'}
          showCreateModal={currentPage === 'course-management' && !currentCourseId}
          editCourseId={currentCourseId}
        />
      )}
      {currentPage === 'course-player' && (
        <CoursePlayer 
          courseId={currentCourseId}
          onBack={handleBackFromPlayer}
          onFeedbackSubmitted={handleFeedbackSubmitted}
        />
      )}
      {currentPage === 'dashboard' && (
        currentUser ? (
        currentUser.role === 'instructor' ? (
          <InstructorDashboard 
            ref={instructorDashboardRef}
              onBack={() => window.location.href='/courses'}
            onShowAnalytics={handleShowAnalytics}
          />
        ) : (
          <UserDashboard 
            ref={userDashboardRef}
              onBack={() => window.location.href='/courses'}
            onContinueCourse={handleContinueCourse}
          />
        )
        ) : <Navigate to="/" />
      )}
      {currentPage === 'course-analytics' && (
        <CourseAnalytics 
          courseId={analyticsCourseId}
          onBack={handleBackFromAnalytics}
        />
      )}
      {currentPage === 'about' && (
        <AboutUsPage />
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
          handleGoogleLogin={handleGoogleLogin}
          isLoading={isLoading}
        />
      )}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export default App;