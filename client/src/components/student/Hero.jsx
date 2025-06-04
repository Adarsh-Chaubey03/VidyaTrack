import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center
     bg-gradient-to-b from-cyan-100/70'>
      
      <h1 className='md:text-5xl text-3xl font-bold text-gray-800 max-w-3xl mx-auto relative'>
        Unlock Knowledge & Power Your Career with
        <span className='text-blue-600'> Personalized Learning</span>
        <img 
          src={assets.sketch} 
          alt="sketch" 
          className='md:block hidden absolute -bottom-7 right-0' 
        />
      </h1>

      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>
        Discover industry-relevant courses, upskill at your pace, and achieve your goals with expert-led content,
        practical projects, and seamless learning — anytime, anywhere.
      </p>

      <p className='md:block hidden text-gray-500 max-w-md mx-auto'>
        Join thousands of learners and explore curated content designed to help you grow in tech, business, and more.
      </p>
      <SearchBar/>
    </div>
  )
}

export default Hero
