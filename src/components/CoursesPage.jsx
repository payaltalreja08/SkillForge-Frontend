import React from 'react';
import CourseCard from './CourseCard';
import { Loader2, AlertCircle } from 'lucide-react';

const CoursesPage = ({ courses, onCourseSelect, onStartCourse, purchasedCourses = [], loading = false, error = null }) => {
  if (loading) {
    return (
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
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No courses available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard 
                key={course._id} 
                course={course} 
                onClick={onCourseSelect}
                onStartCourse={onStartCourse}
                isPurchased={purchasedCourses.includes(course._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;