import React from 'react';

const HeroSection = ({ onExploreClick }) => {
  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Master New Skills with
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                SkillForge
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Learn from industry experts and transform your career with our comprehensive online courses. 
              Join thousands of learners who've already upgraded their skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onExploreClick}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Courses
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-1 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                alt="Learning Experience" 
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;