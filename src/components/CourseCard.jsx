
import React from 'react';
import { Star, Users, Clock } from 'lucide-react';

const CourseCard = ({ course, onClick }) => {
  const handleClick = () => {
    onClick(course);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden"
      onClick={handleClick}
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
};

export default CourseCard;