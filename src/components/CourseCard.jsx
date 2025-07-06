import React from 'react';
import { Star, Users, Clock, Play } from 'lucide-react';

const CourseCard = ({ course, onClick, onStartCourse, isPurchased = false }) => {
  const handleClick = () => {
    if (!isPurchased) {
      onClick(course);
    }
  };

  const handleStartCourse = (e) => {
    e.stopPropagation();
    onStartCourse(course._id);
  };

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
    modules: course.modules?.map(module => module.title || module) || []
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden ${
        !isPurchased ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={courseData.image?.startsWith('/uploads') 
            ? `http://localhost:5000${courseData.image}` 
            : '/default-course.png'} 
          alt={courseData.title}
          className="w-full h-48 object-cover"
        />
        {!isPurchased && (
          <>
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
              ${courseData.price}
            </div>
            {courseData.originalPrice > courseData.price && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Save ${(courseData.originalPrice - courseData.price).toFixed(2)}
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{courseData.title}</h3>
        <p className="text-gray-600 mb-4">by {courseData.instructor}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold text-gray-700">{courseData.rating || 0}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="h-4 w-4 mr-1" />
            {courseData.students.toLocaleString()}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {courseData.duration}
          </div>
        </div>
        {!isPurchased && courseData.originalPrice > courseData.price && (
          <div className="text-sm text-gray-500 line-through mb-2">
            Original: ${courseData.originalPrice}
          </div>
        )}
        {isPurchased ? (
          <button
            onClick={handleStartCourse}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Start Course</span>
          </button>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onClick(course); }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Buy</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;