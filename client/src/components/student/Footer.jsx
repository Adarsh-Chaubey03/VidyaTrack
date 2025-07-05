import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 border-t border-green-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6 text-center">
            <div>
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                VidyaTrack
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                Empowering learners with world-class education anywhere, anytime. Join millions of students on their learning journey.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
                Connect With Us
              </h4>
              <div className="flex space-x-4 justify-center">
                <a 
                  href="#" 
                  aria-label="Facebook"
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 hover:bg-green-50 dark:hover:bg-gray-700 group"
                >
                  <Facebook size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                </a>
                <a 
                  href="#" 
                  aria-label="Twitter"
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 hover:bg-green-50 dark:hover:bg-gray-700 group"
                >
                  <Twitter size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                </a>
                <a 
                  href="#" 
                  aria-label="LinkedIn"
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 hover:bg-green-50 dark:hover:bg-gray-700 group"
                >
                  <Linkedin size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                </a>
                <a 
                  href="#" 
                  aria-label="Email"
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 hover:bg-green-50 dark:hover:bg-gray-700 group"
                >
                  <Mail size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">
              Explore
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/courses" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Courses</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Blog</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">FAQs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Feedback</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Join our newsletter for the latest updates, course announcements, and exclusive offers.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-green-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} VidyaTrack. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Made by Adarsh Chaubey
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
