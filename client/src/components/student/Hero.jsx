import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

function Hero() {
  return (
    <div 
      className='flex flex-col items-center justify-center w-full md:pt-20 pt-10 px-7 md:px-0 space-y-7 text-center relative min-h-screen'
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${assets.hero_bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h1 className='md:text-5xl text-3xl font-bold text-white max-w-3xl mx-auto relative z-10'>
        Empower Your Future: <span className='text-green-400'>Personalized Growth & Career Tools</span>
      </h1>
      <p className='md:block hidden text-gray-200 max-w-2xl mx-auto z-10'>
        Don't Journey Solo—Unlock Your Potential with 1:1 Mentorship and Career-Building Tools from Top Experts in Tech, Business, and Beyond!
      </p>
      <div className='z-10'>
        <SearchBar/>
      </div>
    </div>
  )
}

export default Hero
