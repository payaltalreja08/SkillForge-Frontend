import React from 'react';
import { X, Award, Eye, EyeOff, Loader2 } from 'lucide-react';

// AuthModal Component
const AuthModal = ({ 
  showAuthModal, 
  setShowAuthModal, 
  authMode, 
  setAuthMode, 
  authForm, 
  setAuthForm, 
  authErrors, 
  setAuthErrors, 
  showPassword, 
  setShowPassword, 
  handleAuthSubmit,
  handleInputChange,
  handleGoogleLogin,
  isLoading = false
}) => {
  if (!showAuthModal) return null;

  const handleModeSwitch = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setAuthErrors({});
    setAuthForm({ 
      email: '', 
      password: '', 
      confirmPassword: '', 
      fullName: '',
      role: 'student',
      learnerType: '',
      degree: '',
      jobType: '',
      domain: '',
      experience: ''
    });
  };

  const handleClose = () => {
    setShowAuthModal(false);
    setAuthErrors({});
    setAuthForm({ 
      email: '', 
      password: '', 
      confirmPassword: '', 
      fullName: '',
      role: 'student',
      learnerType: '',
      degree: '',
      jobType: '',
      domain: '',
      experience: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SkillForge
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {authMode === 'login' ? 'Welcome Back!' : 'Join SkillForge'}
          </h2>
          <p className="text-gray-600">
            {authMode === 'login' 
              ? 'Sign in to continue your learning journey' 
              : 'Start your learning journey today'
            }
          </p>
        </div>

        {/* General Error Message */}
        {authErrors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{authErrors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          {authMode === 'register' && (
            <div key="fullName-field">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={authForm.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  authErrors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={isLoading}
              />
              {authErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{authErrors.fullName}</p>
              )}
            </div>
          )}

          {authMode === 'register' && (
            <div key="role-field">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'student')}
                  className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                    authForm.role === 'student'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  } ${authErrors.role ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg mb-1">👨‍🎓</span>
                    <span>Student</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'instructor')}
                  className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                    authForm.role === 'instructor'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  } ${authErrors.role ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg mb-1">👨‍🏫</span>
                    <span>Instructor</span>
                  </div>
                </button>
              </div>
              {authErrors.role && (
                <p className="text-red-500 text-sm mt-1">{authErrors.role}</p>
              )}
            </div>
          )}

          {/* Student-specific fields */}
          {authMode === 'register' && authForm.role === 'student' && (
            <>
              <div key="learnerType-field">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learner Type
                </label>
                <select
                  value={authForm.learnerType}
                  onChange={(e) => handleInputChange('learnerType', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    authErrors.learnerType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Select your learner type</option>
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                </select>
                {authErrors.learnerType && (
                  <p className="text-red-500 text-sm mt-1">{authErrors.learnerType}</p>
                )}
              </div>

              <div key="degree-field">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree/Qualification (Optional)
                </label>
                <input
                  type="text"
                  value={authForm.degree}
                  onChange={(e) => handleInputChange('degree', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., Bachelor's in Computer Science"
                  disabled={isLoading}
                />
              </div>

              <div key="jobType-field">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type (Optional)
                </label>
                <input
                  type="text"
                  value={authForm.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., Software Developer, Student"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {/* Instructor-specific fields */}
          {authMode === 'register' && authForm.role === 'instructor' && (
            <>
              <div key="domain-field">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain of Expertise
                </label>
                <input
                  type="text"
                  value={authForm.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    authErrors.domain ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Web Development, Data Science"
                  disabled={isLoading}
                />
                {authErrors.domain && (
                  <p className="text-red-500 text-sm mt-1">{authErrors.domain}</p>
                )}
              </div>

              <div key="experience-field">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={authForm.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    authErrors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 5"
                  disabled={isLoading}
                />
                {authErrors.experience && (
                  <p className="text-red-500 text-sm mt-1">{authErrors.experience}</p>
                )}
              </div>
            </>
          )}

          <div key="email-field">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                authErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isLoading}
            />
            {authErrors.email && (
              <p className="text-red-500 text-sm mt-1">{authErrors.email}</p>
            )}
          </div>

          <div key="password-field">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={authForm.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12 transition-colors ${
                  authErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {authErrors.password && (
              <p className="text-red-500 text-sm mt-1">{authErrors.password}</p>
            )}
          </div>

          {authMode === 'register' && (
            <div key="confirmPassword-field">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={authForm.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  authErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isLoading}
              />
              {authErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{authErrors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleAuthSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              authMode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={handleModeSwitch}
              disabled={isLoading}
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;