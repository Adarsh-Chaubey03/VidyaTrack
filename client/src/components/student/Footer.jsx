import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-emerald-50 to-emerald-100 border-t border-gray-200 pt-8 md:pt-12 pb-4 flex flex-col items-center justify-center">
      <div className="w-full flex justify-center items-center px-1 md:px-2">
        <div className="rounded-2xl md:rounded-3xl bg-white shadow-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-8 max-w-8xl w-full mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Brand Section */}
            <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
              <h2 className="text-xl md:text-2xl font-extrabold text-emerald-600 mb-1 md:mb-2">VidyaTrack</h2>
              <p className="text-gray-600 mb-2 md:mb-4 text-xs md:text-sm">
                Empowering learners with world-class education anywhere, anytime.
              </p>
              <div className="flex gap-2 md:gap-3 justify-center">
                <a href="#" className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-full p-2 transition">
                  <Facebook size={18} />
                </a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-2 transition">
                  <Twitter size={18} />
                </a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-2 transition">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="bg-pink-100 hover:bg-pink-200 text-pink-500 rounded-full p-2 transition">
                  <Mail size={18} />
                </a>
              </div>
            </div>
            {/* Explore Section */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-base md:text-lg font-bold text-emerald-600 mb-2 md:mb-4">Explore</h3>
              <ul className="space-y-1 md:space-y-2 text-sm">
                <li><Link to="/course-list" className="hover:text-emerald-600 transition cursor-pointer">Courses</Link></li>
                <li><Link to="/about" className="hover:text-emerald-600 transition cursor-pointer">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-emerald-600 transition cursor-pointer">Blog</Link></li>
                <li><Link to="/faqs" className="hover:text-emerald-600 transition cursor-pointer">FAQs</Link></li>
            </ul>
          </div>
            {/* Support Section */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-base md:text-lg font-bold text-emerald-600 mb-2 md:mb-4">Support</h3>
              <ul className="space-y-1 md:space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-emerald-600 transition cursor-pointer">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-emerald-600 transition cursor-pointer">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-emerald-600 transition cursor-pointer">Privacy Policy</Link></li>
                <li><Link to="/feedback" className="hover:text-emerald-600 transition cursor-pointer">Feedback</Link></li>
            </ul>
          </div>
            {/* Newsletter Section */}
            <div className="flex flex-col items-center text-center mr-1 col-span-2 md:col-span-1">
              <h3 className="text-base md:text-lg font-bold text-emerald-600 mb-2 md:mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-2 md:mb-4 text-xs md:text-sm">
                Join our newsletter for the latest updates and offers.
              </p>
              <form className="w-full max-w-xs flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 md:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none text-sm"
                />
              <button
                type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2 transition"
              >
                  Subscribe
              </button>
            </form>
          </div>
        </div>
      {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-3 md:pt-4">
            <p className="text-xs md:text-sm text-gray-500">&copy; {new Date().getFullYear()} VidyaTrack. All rights reserved.</p>
            <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-0">Made by Adarsh Chaubey</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
