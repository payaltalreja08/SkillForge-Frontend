import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, Pause, Volume2, VolumeX, Maximize, MoreVertical, MessageCircle, BookOpen, Star, Download, Bot } from 'lucide-react';
import QuizComponent from './QuizComponent';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

const CoursePlayer = ({ courseId, onBack, onFeedbackSubmitted }) => {
  // Guard: If courseId is not provided, show error and back button
  if (!courseId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600 text-lg font-semibold mb-4">No course selected. Please go back and select a course.</p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { courseId: urlCourseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [progress, setProgress] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 5, review: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [progressWarning, setProgressWarning] = useState('');
  
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const lastTimeRef = useRef(Date.now());
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFeedbackCertificate, setShowFeedbackCertificate] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackThankYou, setFeedbackThankYou] = useState(false);

  const isMobile = window.innerWidth < 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch course');
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/progress/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProgress(data.progress || {});
          setProgressWarning('');
        } else if (response.status === 403) {
          setProgress({});
          setProgressWarning('Progress tracking is unavailable. Please enroll to track your progress.');
        } else if (response.status === 404) {
          setProgress({});
          setProgressWarning('Progress not found for this course.');
        }
      } catch (err) {
        setProgress({});
        setProgressWarning('Error fetching progress.');
      }
    };
    if (course) fetchProgress();
  }, [courseId, course]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/courses/comments?courseId=${courseId}&moduleIndex=${currentModule}&videoIndex=${currentVideo}`
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    if (course) fetchComments();
  }, [courseId, currentModule, currentVideo, course]);

  // Update progress when video changes
  useEffect(() => {
    if (course && progress) {
      updateProgress();
    }
  }, [currentModule, currentVideo]);

  const updateProgress = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_BASE_URL}/api/progress/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleIndex: currentModule,
          videoIndex: currentVideo,
          completed: true
        })
      });
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleVideoSelect = async (moduleIndex, videoIndex) => {
    setCurrentModule(moduleIndex);
    setCurrentVideo(videoIndex);
    // Mark video as watched when selected
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_BASE_URL}/api/progress/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleIndex,
          videoIndex,
          completed: true
        })
      });
      // Fetch updated progress
      const response = await fetch(`${API_BASE_URL}/api/progress/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress || {});
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/courses/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          moduleIndex: currentModule,
          videoIndex: currentVideo,
          text: newComment
        })
      });
      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment('');
        showToast('Comment posted!', 'success');
      } else {
        showToast('Failed to post comment.', 'error');
      }
    } catch (err) {
      showToast('Error posting comment.', 'error');
    }
  };

  const handleAIQuestion = async () => {
    if (!aiQuestion.trim()) return;
    
    setAiResponse('Thinking...');
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question: aiQuestion,
          context: currentVideoData?.description || course?.description || 'Course content'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      setAiResponse(data.answer || 'No answer from AI.');
    } catch (err) {
      console.error('Error getting AI response:', err);
      setAiResponse('Sorry, I encountered an error while processing your question. Please try again.');
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.review.trim() || feedback.rating < 1) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/courses/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          rating: feedback.rating,
          review: feedback.review
        })
      });
      if (response.ok) {
        setShowFeedback(false);
        showToast('Feedback submitted! You can now download your certificate.', 'success');
      } else {
        showToast('Failed to submit feedback.', 'error');
      }
    } catch (err) {
      showToast('Error submitting feedback.', 'error');
    }
  };

  const downloadCertificate = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/certificate/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${course.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (response.status === 403) {
        showToast('You are not authorized to download the certificate. Please log in or purchase the course.', 'error');
        return;
      } else if (response.status === 404) {
        showToast('Certificate not found for this course.', 'error');
        return;
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate course progress percentage
  const totalVideos = course?.modules?.reduce((sum, m) => sum + m.videos.length, 0) || 0;
  const completedVideos = Object.values(progress).filter(p => p.completed).length;
  const courseProgressPercent = totalVideos ? Math.round((completedVideos / totalVideos) * 100) : 0;

  // After courseProgressPercent calculation:
  const courseCompleted = courseProgressPercent === 100;

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 2500);
  };

  // Track time spent
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendTimeSpent();
      } else {
        lastTimeRef.current = Date.now();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      sendTimeSpent();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line
  }, [courseId]);

  // Increment time spent every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Send time spent to backend
  const sendTimeSpent = async () => {
    if (timeSpent > 0) {
      try {
        const token = localStorage.getItem('authToken');
        await fetch(`${API_BASE_URL}/api/courses/update-time`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ courseId, timeSpent: Math.round(timeSpent / 60) }) // send minutes
        });
        setTimeSpent(0);
      } catch (err) {
        // ignore
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnded = () => {
    setVideoCompleted(true);
  };

  // Remove playbackRate from <video> and set via useEffect
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // 1. Add a handler for toggling video completion
  const handleVideoCheckbox = async (moduleIndex, videoIndex, checked) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_BASE_URL}/api/progress/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleIndex,
          videoIndex,
          completed: checked
        })
      });
      // Refetch progress from backend
      const response = await fetch(`${API_BASE_URL}/api/progress/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress || {});
      }
    } catch (err) {
      showToast('Error updating progress', 'error');
    }
  };

  // 2. Add a handler for toggling quiz completion
  const handleQuizCheckbox = async (moduleIndex, checked) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_BASE_URL}/api/progress/${courseId}/quiz`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleIndex,
          completed: checked
        })
      });
      // Refetch progress from backend
      const response = await fetch(`${API_BASE_URL}/api/progress/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress || {});
      }
    } catch (err) {
      showToast('Error updating quiz progress', 'error');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!course) return <div className="text-center">Course not found</div>;
  if (!course.modules || course.modules.length === 0) return <div className="text-center">No modules found in this course</div>;

  const currentVideoData = course.modules[currentModule]?.videos[currentVideo];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
      <div className="flex flex-1 flex-col md:flex-row-reverse w-full">
        {/* Sidebar */}
        {isMobile ? (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" style={{ display: sidebarOpen ? 'block' : 'none' }}>
            <div className="absolute right-0 top-0 h-full w-3/4 bg-white shadow-lg overflow-y-auto">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-2 right-2 text-gray-600">Close</button>
              <div className="p-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    <div className="space-y-1">
                      {(Array.isArray(module.videos) && module.videos.length > 0) ? (
                        module.videos.map((video, videoIndex) => {
                          const isCompleted = progress[`${moduleIndex}-${videoIndex}`]?.completed;
                          const isActive = currentModule === moduleIndex && currentVideo === videoIndex;
                          return (
                            <button
                              key={videoIndex}
                              onClick={() => handleVideoSelect(moduleIndex, videoIndex)}
                              className={`w-full text-left p-2 rounded text-sm ${
                                isActive
                                  ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                                  : isCompleted
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                              <div className="flex items-center">
                                {/* Interactive checkbox for completion */}
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-5 w-5 text-green-500 mr-2"
                                  checked={!!isCompleted}
                                  onChange={e => handleVideoCheckbox(moduleIndex, videoIndex, e.target.checked)}
                                  aria-label={video.title || `Video ${videoIndex + 1}`}
                                />
                                <span className="truncate">{video.title || `Video ${videoIndex + 1}`}</span>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-gray-400 italic text-xs">No videos in this module</div>
                      )}
                      {module.quizzes && module.quizzes.length > 0 && (
                        <button
                          onClick={() => { setCurrentModule(moduleIndex); setShowQuiz(true); }}
                          className={`w-full text-left p-2 rounded text-sm ${showQuiz && currentModule === moduleIndex ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-500' : 'text-purple-600 hover:bg-purple-50'}`}
                        >
                          <div className="flex items-center">
                            {/* Interactive checkbox for quiz completion */}
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-purple-500 mr-2"
                              checked={!!progress[`quiz-${moduleIndex}`]?.completed}
                              onChange={e => handleQuizCheckbox(moduleIndex, e.target.checked)}
                              aria-label={`Quiz for module ${moduleIndex + 1}`}
                            />
                            <span className="truncate">Quiz</span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-1/4 max-w-xs bg-white shadow-lg overflow-y-auto border-l border-gray-200">
            <div className="p-4 border-b">
              <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Courses
              </button>
              <h2 className="text-xl font-bold mt-2">{course.name}</h2>
            </div>
            <div className="p-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                  <div className="space-y-1">
                    {(Array.isArray(module.videos) && module.videos.length > 0) ? (
                      module.videos.map((video, videoIndex) => {
                        const isCompleted = progress[`${moduleIndex}-${videoIndex}`]?.completed;
                        const isActive = currentModule === moduleIndex && currentVideo === videoIndex;
                        return (
                          <button
                            key={videoIndex}
                            onClick={() => handleVideoSelect(moduleIndex, videoIndex)}
                            className={`w-full text-left p-2 rounded text-sm ${
                              isActive
                                ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                                : isCompleted
                                  ? 'bg-green-50 text-green-700'
                                  : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              {/* Interactive checkbox for completion */}
                              <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-green-500 mr-2"
                                checked={!!isCompleted}
                                onChange={e => handleVideoCheckbox(moduleIndex, videoIndex, e.target.checked)}
                                aria-label={video.title || `Video ${videoIndex + 1}`}
                              />
                              <span className="truncate">{video.title || `Video ${videoIndex + 1}`}</span>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-gray-400 italic text-xs">No videos in this module</div>
                    )}
                    {module.quizzes && module.quizzes.length > 0 && (
                      <button
                        onClick={() => { setCurrentModule(moduleIndex); setShowQuiz(true); }}
                        className={`w-full text-left p-2 rounded text-sm ${showQuiz && currentModule === moduleIndex ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-500' : 'text-purple-600 hover:bg-purple-50'}`}
                      >
                        <div className="flex items-center">
                          {/* Interactive checkbox for quiz completion */}
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-purple-500 mr-2"
                            checked={!!progress[`quiz-${moduleIndex}`]?.completed}
                            onChange={e => handleQuizCheckbox(moduleIndex, e.target.checked)}
                            aria-label={`Quiz for module ${moduleIndex + 1}`}
                          />
                          <span className="truncate">Quiz</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full md:w-3/4 max-w-full p-2">
          {/* Video Player */}
          <div className="bg-black relative">
            <video
              ref={videoRef}
              className="w-full h-56 sm:h-72 md:h-96 object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              onEnded={handleVideoEnded}
              controls={false}
              muted={isMuted}
            >
              {currentVideoData?.url && (
                <source src={currentVideoData.url.startsWith('/uploads') 
                  ? `http://localhost:5000${currentVideoData.url}` 
                  : currentVideoData.url} type="video/mp4" />
              )}
              Your browser does not support the video tag.
            </video>
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={togglePlay} className="text-white">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <span className="text-white text-xs sm:text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <select
                  value={playbackRate}
                  onChange={e => {
                    setPlaybackRate(Number(e.target.value));
                  }}
                  className="ml-2 px-2 py-1 rounded border text-xs"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
                <div className="flex-1" />
                <button className="text-white" onClick={handleMute}>
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button className="text-white" onClick={handleFullscreen}>
                  <Maximize className="w-5 h-5" />
                </button>
                <button className="text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Video Slider (Seek Bar) */}
            <div className="w-full flex items-center px-4 py-2 bg-black">
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={e => {
                  const time = Number(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = time;
                  setCurrentTime(time);
                }}
                className="w-full accent-blue-500 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Take Quiz or Feedback/Certificate Buttons */}
          {!showQuiz && course.modules[currentModule]?.quizzes?.length > 0 && (
            <div className="flex justify-end mt-4">
              {showFeedbackCertificate && currentModule === course.modules.length - 1 ? (
                <div className="flex flex-col items-end space-y-2 w-full">
                  <button
                    onClick={downloadCertificate}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center hover:bg-green-700 mb-2"
                  >
                    <Download className="w-6 h-6 mr-2" /> Download Certificate
                  </button>
                  <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center hover:bg-yellow-600"
                  >
                    <Star className="w-6 h-6 mr-2" /> Leave Feedback (Optional)
                  </button>
                </div>
              ) : (
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded ml-4 hover:bg-purple-700 transition"
                  onClick={() => setShowQuiz(true)}
                >
                  Take Quiz
                </button>
              )}
            </div>
          )}
          {showQuiz && course.modules[currentModule]?.quizzes?.length > 0 && (
            <QuizComponent
              quizzes={course.modules[currentModule].quizzes}
              onNext={() => {
                setShowQuiz(false);
                setVideoCompleted(false);
                if (currentModule < course.modules.length - 1) {
                  setCurrentModule(currentModule + 1);
                  setCurrentVideo(0);
                } else {
                  setShowFeedbackCertificate(true);
                }
              }}
              isLastModule={currentModule === course.modules.length - 1}
            />
          )}

          {/* Tab Navigation */}
          <div className="flex justify-center bg-white border-b shadow-sm z-10">
            <div className="flex flex-wrap space-x-0 sm:space-x-2 max-w-3xl w-full px-2 sm:px-4">
              <button
                onClick={() => { setShowComments(true); setShowAI(false); setShowFeedback(false); }}
                className={`flex-1 py-2 sm:py-3 text-center font-medium border-b-2 transition-colors text-xs sm:text-base ${showComments ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                <MessageCircle className="w-5 h-5 inline mr-1" /> Comments
              </button>
              <button
                onClick={() => { setShowComments(false); setShowAI(true); setShowFeedback(false); }}
                className={`flex-1 py-2 sm:py-3 text-center font-medium border-b-2 transition-colors text-xs sm:text-base ${showAI ? 'border-purple-600 text-purple-700 bg-purple-50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                <Bot className="w-5 h-5 inline mr-1" /> AI Assistant
              </button>
            </div>
          </div>

          {/* Tab Content Card */}
          <div className="flex justify-center bg-gray-100 flex-1">
            <div className="w-full max-w-3xl p-2 sm:p-6">
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 min-h-[350px] mb-12">
                {/* Comments Tab */}
                {showComments && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 border rounded-lg px-3 py-2"
                      />
                      <button
                        onClick={handleCommentSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Post
                      </button>
                    </div>
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment._id} className="border rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              {comment.userId?.name?.charAt(0) || comment.userId?.email?.charAt(0) || 'U'}
                            </div>
                            <span className="font-semibold">{comment.userId?.name || comment.userId?.email || 'Anonymous'}</span>
                            <span className="text-gray-500 text-xs sm:text-sm">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-xs sm:text-base">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Assistant Tab */}
                {showAI && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                      <h3 className="font-semibold mb-2 text-blue-900 text-base sm:text-lg">🤖 AI Learning Assistant</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Ask questions about the current video content and get instant answers powered by Google Gemini AI!
                      </p>
                      {currentVideoData && (
                        <div className="mt-3 p-2 sm:p-3 bg-white rounded border">
                          <p className="text-xs text-gray-500 mb-1">Current Video Context:</p>
                          <p className="text-xs sm:text-sm text-gray-700">{currentVideoData.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <input
                        type="text"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        placeholder="Ask a question about this video..."
                        className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAIQuestion()}
                      />
                      <button
                        onClick={handleAIQuestion}
                        disabled={!aiQuestion.trim() || aiResponse === 'Thinking...'}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <span>Ask AI</span>
                      </button>
                    </div>
                    {aiResponse && (
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs">AI</span>
                          </div>
                          <h4 className="font-semibold text-gray-800 text-xs sm:text-base">AI Response:</h4>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-xs sm:text-base">
                          {aiResponse === 'Thinking...' ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                              <span>Processing your question...</span>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{aiResponse}</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="font-medium mb-1">💡 Tips for better AI responses:</p>
                      <ul className="space-y-1">
                        <li>• Be specific about what you want to learn</li>
                        <li>• Ask follow-up questions for deeper understanding</li>
                        <li>• The AI has context from the current video content</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add bottom padding to prevent footer overlap */}
      <div className="h-16" />
      {progressWarning && (
        <div className="text-red-500 text-center">{progressWarning}</div>
      )}
      <FeedbackModal
        open={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedback={feedback}
        setFeedback={setFeedback}
        submitting={submittingFeedback}
        onSubmit={async () => {
          setSubmittingFeedback(true);
          try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/courses/feedback`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                courseId,
                rating: feedback.rating,
                review: feedback.review
              })
            });
                         if (response.ok) {
               setFeedbackThankYou(true);
               // Notify parent component about feedback submission
               if (onFeedbackSubmitted) {
                 onFeedbackSubmitted();
               }
               setTimeout(() => {
                 setShowFeedbackModal(false);
                 setFeedbackThankYou(false);
                 setFeedback({ rating: 5, review: '' });
               }, 1800);
             } else {
               const data = await response.json();
               showToast(data.message || 'Failed to submit feedback', 'error');
             }
          } catch (err) {
            showToast('Error submitting feedback', 'error');
          } finally {
            setSubmittingFeedback(false);
          }
        }}
      />
      {feedbackThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-green-600">Thank you for your feedback!</h2>
            <p className="text-gray-700">We appreciate your input.</p>
          </div>
        </div>
      )}
    </div>
  );
};

function FeedbackModal({ open, onClose, onSubmit, feedback, setFeedback, submitting }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Leave Feedback</h2>
        <div className="flex items-center justify-center mb-4">
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              type="button"
              className={`text-3xl ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setFeedback(f => ({ ...f, rating: star }))}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="w-full border rounded-lg p-3 mb-4 min-h-[80px]"
          placeholder="Share your experience..."
          value={feedback.review}
          onChange={e => setFeedback(f => ({ ...f, review: e.target.value }))}
          minLength={10}
          maxLength={500}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          onClick={onSubmit}
          disabled={submitting || feedback.rating < 1 || feedback.review.length < 10}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
}

export default CoursePlayer; 