import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Footer from '../../components/student/Footer';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-emerald-50">
      {/* Breadcrumbs */}
      <div className="px-12 md:px-16 lg:px-24 pt-12 md:pt-16">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 md:px-16 lg:px-24 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-20 md:mb-24">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Need help with your VidyaTrack service or product? We'll get the help you need.
            </p>
          </div>

          {/* Contact Card with Illustrations */}
          <div className="relative flex items-center justify-center">
            {/* Left Character Illustration */}
            <div className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
              <div className="relative">
                {/* Character */}
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center relative">
                        {/* Face */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-3 h-3 bg-emerald-700 rounded-full mb-1"></div>
                          <div className="w-6 h-3 bg-emerald-700 rounded-full"></div>
                        </div>
                        {/* Glasses */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                          <div className="w-8 h-4 border-2 border-emerald-700 rounded-full"></div>
                        </div>
                        {/* Ponytail */}
                        <div className="absolute -top-2 -right-2 w-8 h-12 bg-emerald-700 rounded-full transform rotate-12"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Waving Hand */}
                <div className="absolute top-8 right-0 w-6 h-8 bg-emerald-500 rounded-full transform rotate-12 animate-bounce"></div>
                
                {/* Dashed Line to Contact Box */}
                <div className="absolute top-1/2 right-0 w-32 h-0.5 border-t-2 border-dashed border-emerald-400 transform translate-x-8"></div>
              </div>
            </div>

            {/* Central Contact Information Box */}
            <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-12 md:p-16 lg:p-20 shadow-2xl max-w-4xl w-full">
              {/* Background Graphics */}
              <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <Mail size={24} className="text-emerald-600" />
                </div>
              </div>
              
              {/* Dots Pattern */}
              <div className="absolute top-6 right-20 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full opacity-30"></div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative z-10">
                {/* Phone */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Phone size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Toll Free</h3>
                  <p className="text-emerald-100 text-sm">1800 102 5301</p>
                </div>

                {/* Email */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Mail size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Support</h3>
                  <p className="text-emerald-100 text-sm break-all">support@vidyatrack.com</p>
                </div>

                {/* Address */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Address</h3>
                  <p className="text-emerald-100 text-sm">VidyaTrack Education Pvt. Ltd.<br />Plot No- 95B, Sector 136<br />Noida, Uttar Pradesh 201304</p>
                </div>
              </div>
            </div>

            {/* Right Character Illustration */}
            <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <div className="relative">
                {/* Character */}
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center relative">
                        {/* Face */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-3 h-3 bg-emerald-700 rounded-full mb-1"></div>
                          <div className="w-6 h-3 bg-emerald-700 rounded-full"></div>
                        </div>
                        {/* Glasses */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                          <div className="w-8 h-4 border-2 border-emerald-700 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phone in Hand */}
                <div className="absolute top-12 -left-4 w-6 h-10 bg-gray-600 rounded-lg transform -rotate-12"></div>
                
                {/* Speech Bubble */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-lg px-3 py-2 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                </div>
                
                {/* Dashed Line to Contact Box */}
                <div className="absolute top-1/2 left-0 w-32 h-0.5 border-t-2 border-dashed border-emerald-400 transform -translate-x-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Contact Methods */}
      <div className="px-12 md:px-16 lg:px-24 py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Other Ways to Reach Us
            </h2>
            <p className="text-lg text-gray-600">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {/* Live Chat */}
            <div className="text-center p-8 md:p-10 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Start Chat
              </button>
            </div>

            {/* Help Center */}
            <div className="text-center p-8 md:p-10 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Help Center</h3>
              <p className="text-gray-600 mb-4">Find answers to common questions</p>
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Browse FAQ
              </button>
            </div>

            {/* Community */}
            <div className="text-center p-8 md:p-10 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 mb-4">Connect with other learners</p>
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
