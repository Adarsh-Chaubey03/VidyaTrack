import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-20 pt-10 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-emerald-100 to-white'>
      <h1 className='md:text-5xl text-3xl font-bold text-gray-800 max-w-3xl mx-auto relative'>
        Empower Your Future: <span className='text-green-600'>Personalized Growth & Career Tools</span>
      </h1>
      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>
        Don't Journey Solo—Unlock Your Potential with 1:1 Mentorship and Career-Building Tools from Top Experts in Tech, Business, and Beyond!
      </p>
      <SearchBar/>
    </div>
  )
}

export default Hero
