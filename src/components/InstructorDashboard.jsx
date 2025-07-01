import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { User, BookOpen, Users, Star, MessageSquare, Clock, TrendingUp, Eye, Award, Calendar, RefreshCw, Plus } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const InstructorDashboard = forwardRef(({ onBack, onShowAnalytics, refreshTrigger }, ref) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/instructor/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchDashboardData
  }));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Always fetch fresh data when component mounts or refresh is triggered
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      fetchDashboardData();
    }
  }, [refreshTrigger]);

  // Fetch fresh data when user navigates to dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    }, 30000); // Refresh every 30 seconds when tab is visible

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { instructor, stats, courses } = dashboardData;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            {instructor.profileImage ? (
              <img 
                src={instructor.profileImage} 
                alt={instructor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
            <p className="text-blue-100 mb-2">{instructor.domain}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Joined {formatDate(instructor.joinedOn)}</span>
              <span className="flex items-center"><Award className="w-4 h-4 mr-1" /> {instructor.experience} years experience</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <div className="flex items-center justify-end">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Your Courses</h2>
          <button
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-5 h-5 mr-1" /> Add Course
          </button>
        </div>
        <div className="p-6">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">You haven't created any courses yet.</p>
              <button 
                onClick={onBack}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Create Course
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {courses.map(course => (
                <div key={course._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <img 
                    src={course.thumbnail || '/default-course.png'} 
                    alt={course.name}
                    className="w-20 h-14 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{course.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {course.studentsEnrolled} enrolled</span>
                      <span className="flex items-center"><Star className="w-4 h-4 mr-1" /> {course.averageRating}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {course.duration} hours</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{formatCurrency(course.price)}</div>
                    <div className="text-sm text-gray-500">Revenue: {formatCurrency(course.revenue)}</div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveView('analytics');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Analytics
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Course creation modal/form */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCreateForm(false)}
            >
              ×
            </button>
            {/* You can render your CourseForm component here */}
            <h3 className="text-xl font-bold mb-4">Create New Course</h3>
            <p>Course creation form goes here.</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    if (!selectedCourse) return null;
    // Restore mock analytics data
    const analytics = {
      userEngagement: [
        { week: 'Week 1', watchTime: 85, completion: 92 },
        { week: 'Week 2', watchTime: 78, completion: 87 },
        { week: 'Week 3', watchTime: 82, completion: 89 },
        { week: 'Week 4', watchTime: 88, completion: 94 }
      ],
      peakWatchTimes: [
        { time: '9:00 AM', viewers: 450 },
        { time: '1:00 PM', viewers: 380 },
        { time: '7:00 PM', viewers: 620 },
        { time: '9:00 PM', viewers: 520 }
      ],
      feedback: [
        { rating: 5, count: 1200, percentage: 60 },
        { rating: 4, count: 600, percentage: 30 },
        { rating: 3, count: 150, percentage: 7.5 },
        { rating: 2, count: 40, percentage: 2 },
        { rating: 1, count: 10, percentage: 0.5 }
      ],
      comments: selectedCourse.recentComments || []
    };

    return (
      <div className="space-y-6">
        {/* Course Header */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setActiveView('overview')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Overview
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src={selectedCourse.thumbnail || '/default-course.png'} 
              alt={selectedCourse.name}
              className="w-16 h-12 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h2>
              <p className="text-gray-600">{selectedCourse.studentsEnrolled} students enrolled</p>
            </div>
          </div>
        </div>

        {/* Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Enrolled Students</p>
                <p className="text-2xl font-bold text-gray-800">{selectedCourse.studentsEnrolled}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-gray-800">{selectedCourse.averageRating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(selectedCourse.revenue)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Course Price</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(selectedCourse.price)}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Student Engagement Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.userEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="watchTime" stroke="#8884d8" strokeWidth={2} name="Watch Time %" />
              <Line type="monotone" dataKey="completion" stroke="#82ca9d" strokeWidth={2} name="Completion %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Watch Times */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Peak Watch Times</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.peakWatchTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="viewers" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {analytics.feedback.map(item => (
              <div key={item.rating} className="flex items-center space-x-3">
                <span className="w-8 text-sm font-medium">{item.rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-400 h-3 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments */}
        {analytics.comments.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Recent Student Comments</h3>
            <div className="space-y-4">
              {analytics.comments.map((comment, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-800">{comment.user?.name || 'Anonymous'}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < (comment.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-600">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-2"
            >
              ← Back to Courses
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {activeView === 'overview' ? renderOverview() : renderAnalytics()}
      </div>
    </div>
  );
});

export default InstructorDashboard; 