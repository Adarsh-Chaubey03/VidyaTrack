import React from 'react'
import { assets } from '../../assets/assets'

function Footer() {
    return (
      <footer className="w-full bg-white border-t border-gray-200 py-6 ">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          {/* Left: Logo and copyright */}
          <div className="flex items-center gap-3">
            <img src={assets.eduLogo} alt="VidyaTrack Educator Logo" className="w-28 h-auto pl-5" />
            <span className="text-gray-500 text-sm ml-10">&copy; {new Date().getFullYear()} VidyaTrack. All rights reserved.</span>
          </div>
          {/* Right: Social icons */}
          <div className="flex items-center gap-4 pr-10">
            <a href="#" aria-label="Facebook">
              <img src={assets.facebook_icon} alt="Facebook" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src={assets.instagram_icon} alt="Instagram" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={assets.twitter_icon} alt="Twitter" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
          </div>
        </div>
      </footer>
    )
}

export default Footer
