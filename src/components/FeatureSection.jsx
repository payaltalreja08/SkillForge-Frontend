
import React from 'react';
import { BookOpen, Play, Users, Award } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience"
    },
    {
      icon: <Play className="h-8 w-8" />,
      title: "Interactive Content",
      description: "Engage with hands-on projects and interactive video lessons"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Support",
      description: "Join a thriving community of learners and get help when you need it"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Certificates",
      description: "Earn recognized certificates to showcase your new skills to employers"
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SkillForge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide the best learning experience with cutting-edge technology and expert instructors
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-xl w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;