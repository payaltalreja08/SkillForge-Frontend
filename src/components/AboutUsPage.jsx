import React from 'react';
import { Users, Target, Award, BookOpen, ChevronRight, Star, Github, Instagram, Facebook, Code, Laptop, GraduationCap } from 'lucide-react';

const AboutUsPage = () => {
  const stats = [
    { number: '1000+', label: 'Lines of Code' },
    { number: '50+', label: 'Projects Built' },
    { number: '5+', label: 'Technologies Mastered' },
    { number: '100%', label: 'Passion for Learning' }
  ];

  const values = [
    {
      icon: <Code className="w-8 h-8 text-blue-600" />,
      title: 'Full-Stack Development',
      description: 'Building complete web applications from frontend to backend with modern technologies and best practices.'
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      title: 'Continuous Learning',
      description: 'Always exploring new technologies and frameworks to stay ahead in the rapidly evolving tech landscape.'
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: 'Community Impact',
      description: 'Creating platforms that connect learners and educators, fostering knowledge sharing and growth.'
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: 'Problem Solving',
      description: 'Identifying real-world challenges and building innovative solutions that make a meaningful difference.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-yellow-400">SkillForge</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-200">
              Empowering learners worldwide with high-quality online education and cutting-edge technology to transform careers and lives.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">My Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Hi, I'm Payal Talreja, a passionate B.Tech IT student from Pune Institute of Computer Technology (PICT). 
                SkillForge was born from my belief that quality education should be accessible to everyone, regardless of their background or location.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                As a solo full-stack developer, I've built this platform to bridge the gap between traditional learning and the 
                rapidly evolving demands of the tech industry. My journey from being a student to creating educational solutions 
                has taught me the importance of practical, hands-on learning.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Through SkillForge, I aim to create a community where knowledge flows freely and careers are transformed through 
                the power of technology and continuous learning.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Connect with me on social media</span>
                <ChevronRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Drives SkillForge</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide the development of this platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Profile Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About the Developer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the person behind SkillForge
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto md:mx-0 mb-4 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">PT</span>
                  </div>
                  <div className="flex justify-center md:justify-start space-x-4 mt-4">
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Github className="w-6 h-6" />
                    </a>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Payal Talreja</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    B.Tech IT Student at Pune Institute of Computer Technology (PICT)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Laptop className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-gray-700">Full-Stack Developer</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-gray-700">PICT Student</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-gray-700">EdTech Enthusiast</span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "I believe in the power of technology to democratize education and create opportunities for everyone to learn and grow."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Join the SkillForge community and transform your career with quality education and practical skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Explore Courses
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SkillForge</span>
              </div>
              <p className="text-gray-400">
                Empowering learners worldwide with high-quality online education and cutting-edge technology.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Web Development</a></li>
                <li><a href="#" className="hover:text-white">Data Science</a></li>
                <li><a href="#" className="hover:text-white">Mobile Development</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SkillForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage; 