import React, { useState, useEffect } from 'react';
import { Star, Users, Clock, ShoppingCart, Check, Play } from 'lucide-react';
import CourseCard from './CourseCard';

const CourseDetailPage = ({ 
  course, 
  courses, 
  isPurchased, 
  isLoggedIn, 
  onBuyCourse, 
  onStartCourse,
  onBackToCourses, 
  onCourseSelect 
}) => {
  const [relatedCourses, setRelatedCourses] = useState([]);

  // Get random courses excluding current course
  const getRandomCourses = (excludeId) => {
    const filtered = courses.filter(c => c.id !== excludeId);
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  useEffect(() => {
    if (course) {
      setRelatedCourses(getRandomCourses(course.id));
    }
  }, [course, courses]);

  const handleBuyClick = () => {
    onBuyCourse(course.id);
  };

  const handleStartCourse = () => {
    onStartCourse(course.id);
  };

  const handleCourseClick = (selectedCourse) => {
    onCourseSelect(selectedCourse);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBackToCourses}
          className="mb-8 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Courses
        </button>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {(course.image?.startsWith('/uploads') 
              ? `http://localhost:5000${course.image}` 
              : '/default-course.png') && (
              <img 
                src={course.image?.startsWith('/uploads') 
                  ? `http://localhost:5000${course.image}` 
                  : '/default-course.png'} 
                alt={course.title}
                className="w-full h-64 object-cover rounded-2xl mb-8"
              />
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{course.description}</p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">{course.rating}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-1" />
                {course.students.toLocaleString()} students
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-1" />
                {course.duration}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module._id || module.title || index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{module.title || module}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  ${course.price}
                </div>
                {course.originalPrice > course.price && (
                  <div className="text-lg text-gray-500 line-through">
                    ${course.originalPrice}
                  </div>
                )}
              </div>
              
              {isPurchased ? (
                <div className="space-y-4">
                  <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-semibold">
                    <Check className="h-5 w-5 inline mr-2" />
                    Course Purchased!
                  </div>
                  <button 
                    onClick={handleStartCourse}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Start Course</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleBuyClick}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 mb-4"
                >
                  <ShoppingCart className="h-5 w-5 inline mr-2" />
                  {isLoggedIn ? 'Buy Now' : 'Login to Buy'}
                </button>
              )}
              
              <p className="text-sm text-gray-600 text-center mb-6">
                Instructor: <span className="font-semibold text-gray-900">{course.instructor}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedCourses.map((relatedCourse, idx) => (
              <CourseCard 
                key={relatedCourse._id || relatedCourse.id || idx} 
                course={relatedCourse} 
                onClick={handleCourseClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;