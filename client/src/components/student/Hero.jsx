import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-emerald-100 to-white'>
      <h1 className='md:text-5xl text-3xl font-bold text-gray-800 max-w-3xl mx-auto relative'>
        Empower Your Future: <span className='text-green-600'>Personalized Growth & Career Tools</span>
      </h1>
      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>
        Don't Journey Solo—Unlock Your Potential with 1:1 Mentorship and Career-Building Tools from Top Experts in Tech, Business, and Beyond!
      </p>
      <SearchBar/>
      <div className="flex flex-row flex-wrap justify-center gap-3 mt-8">
        {['EXPLORE COURSES', 'RESUME REVIEW', 'BLOG SECTION', 'INTERVIEW PREP', 'Connect mentor'].map((item) => (
          <span key={item} className="bg-white border border-green-400 text-gray-500 px-5 py-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-emerald-50 transition uppercase">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Hero
