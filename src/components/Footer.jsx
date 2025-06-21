import { Award } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-indigo-400 mr-2" />
            <span className="font-bold text-xl">SkillForge</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering learners worldwide with high-quality online education and professional development.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Courses</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Data Science</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Design</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2025 SkillForge. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
