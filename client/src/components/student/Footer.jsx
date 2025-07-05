import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-gray-100 via-emerald-100 to-emerald-200 border-t border-gray-200 pt-12 pb-4 flex flex-col items-center">
      <div className="w-full mr-20 px-1 md:px-1">
        <div className="rounded-3xl bg-white shadow-2xl p-4 md:p-6 flex flex-col gap-8">
          <div className=" pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
            <div className="pl-5 flex flex-col items-center text-center">
              <h2 className="text-2xl font-extrabold text-emerald-600 mb-2">VidyaTrack</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Empowering learners with world-class education anywhere, anytime.
              </p>
              <div className="flex gap-3 justify-center">
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
              <h3 className="text-lg font-bold text-emerald-600 mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link to="/courses" className="hover:text-emerald-600 transition">Courses</Link></li>
                <li><Link to="/about" className="hover:text-emerald-600 transition">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-emerald-600 transition">Blog</Link></li>
                <li><Link to="/faq" className="hover:text-emerald-600 transition">FAQs</Link></li>
            </ul>
          </div>
            {/* Support Section */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-emerald-600 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/contact" className="hover:text-emerald-600 transition">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-emerald-600 transition">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-emerald-600 transition">Privacy Policy</Link></li>
                <li><Link to="/feedback" className="hover:text-emerald-600 transition">Feedback</Link></li>
            </ul>
          </div>
            {/* Newsletter Section */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-emerald-600 mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Join our newsletter for the latest updates and offers.
              </p>
              <form className="w-full flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none"
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
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-4">
            <p className=" pl-15 text-sm text-gray-500">&copy; {new Date().getFullYear()} VidyaTrack. All rights reserved.</p>
            <p className=" pr-20 text-sm text-gray-400 mt-2 md:mt-0">Made by <span className='text-emerald-600'>Adarsh Chaubey</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
