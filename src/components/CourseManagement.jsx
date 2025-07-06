import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Loader2, AlertCircle } from 'lucide-react';
import CourseForm from './CourseForm';

const CourseManagement = ({ currentUser, onBackToCourses, showCreateModal, editCourseId }) => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  // Fetch instructor's courses
  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      const instructorId = currentUser._id || currentUser.id;
      const response = await fetch(`${API_BASE_URL}/api/courses/instructor/${instructorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const courses = await response.json();
      setMyCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load your courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyCourses();
    }
  }, [currentUser]);

  // Open create modal if showCreateModal prop is true
  useEffect(() => {
    if (showCreateModal) setShowCreateForm(true);
  }, [showCreateModal]);

  // Open edit modal if editCourseId prop is set
  useEffect(() => {
    if (editCourseId && myCourses.length > 0) {
      const courseToEdit = myCourses.find(c => c._id === editCourseId);
      if (courseToEdit) setEditingCourse(courseToEdit);
    }
  }, [editCourseId, myCourses]);

  // Create new course
  const handleCreateCourse = async (courseData) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Determine if it's FormData or JSON
      const isFormData = courseData instanceof FormData;
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // Add Content-Type header for JSON data
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'POST',
        headers,
        body: isFormData ? courseData : JSON.stringify(courseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }

      const newCourse = await response.json();
      setMyCourses([...myCourses, newCourse]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating course:', error);
      alert(error.message);
    }
  };

  // Update course
  const handleUpdateCourse = async (courseData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: courseData // courseData is already FormData from CourseForm
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course');
      }

      const updatedCourse = await response.json();
      setMyCourses(myCourses.map(course => 
        course._id === updatedCourse._id ? updatedCourse : course
      ));
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      alert(error.message);
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingCourse(courseId);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete course');
      }

      setMyCourses(myCourses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.message);
    } finally {
      setDeletingCourse(null);
    }
  };

  // When closing modals, update the URL
  const handleCloseModal = () => {
    setShowCreateForm(false);
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your courses...</p>
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
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchMyCourses}
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button 
              onClick={onBackToCourses}
              className="text-indigo-600 hover:text-indigo-800 font-medium mb-2"
            >
              ← Back to Courses
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600">Manage your courses and content</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </button>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Courses ({myCourses.length})</h2>
          </div>
          
          {myCourses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Plus className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Create your first course to start teaching</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {myCourses.map((course) => (
                <div key={course._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={course.thumbnail && course.thumbnail.startsWith('/uploads')
                          ? `${API_BASE_URL}${course.thumbnail}`
                          : (course.thumbnail || '/default-course.png')}
                        alt={course.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-gray-600 text-sm">{course.category} • {course.level}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{course.studentsEnrolled} students</span>
                          <span>${course.price}</span>
                          <span>{course.duration} hours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`/course/${course._id}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Course"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        disabled={deletingCourse === course._id}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete Course"
                      >
                        {deletingCourse === course._id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Course Modal */}
        {(showCreateForm || editingCourse) && (
          <CourseForm
            course={editingCourse}
            onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
            onCancel={handleCloseModal}
            isEditing={!!editingCourse}
          />
        )}
      </div>
    </div>
  );
};

export default CourseManagement; 