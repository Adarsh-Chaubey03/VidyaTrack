import React, { useRef } from 'react'
import { useState } from 'react';
import Hero from '../../components/student/Hero'
import Feature from '../../components/student/Feature'
import CousreSection from '../../components/student/CousreSection'
import TestimonialSection from '../../components/student/TestimonialSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import Mentor from '../../components/student/Mentor'
import { Link } from 'react-router-dom';
import ResumeReview from '../../components/student/ResumeReview'
import InterviewPrep from '../../components/student/InterviewPrep'
import TestSeries from '../../components/student/TestSeries'
import arrowIcon from '../../assets/arrow_icon.svg';
import StatsSection from '../../components/student/StatsSection';

function Home() {
    const scrollRef = useRef(null);
    const [scrollPos, setScrollPos] = useState(0);
    const cardWidth = 500 + 32; // 500px card + 2rem (32px) gap

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            setScrollPos(scrollRef.current.scrollLeft - cardWidth);
        }
    };
    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
            setScrollPos(scrollRef.current.scrollLeft + cardWidth);
        }
    };
    return (
        <div className='flex flex-col items-center  text-center'>
            <Hero />
            <Feature />
            <StatsSection />
            <CousreSection />
            {/* Consistent section for extra features with shared bg and circle arrow */}
            <div className="relative py-16 bg-gray-50 overflow-hidden flex flex-col items-center w-full">
              {/* Horizontally scrollable cards */}
              <div className="relative w-full">
                {/* Left Arrow */}
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Scroll Left"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                {/* Cards */}
                <div
                  ref={scrollRef}
                  className="w-full flex overflow-x-hidden gap-8 px-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-gray-100"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <Link to="/mentor" className="snap-center shrink-0 w-[700px] h-[320px] flex items-center justify-center rounded-full shadow-2xl shadow-orange-200 border border-orange-200 bg-white/60 backdrop-blur-md">
                    <Mentor />
                  </Link>
                  <div className="snap-center shrink-0 w-[700px] h-[320px] flex items-center justify-center rounded-full shadow-2xl shadow-blue-200 border border-blue-200 bg-white/60 backdrop-blur-md"><ResumeReview /></div>
                  <div className="snap-center shrink-0 w-[700px] h-[320px] flex items-center justify-center rounded-full shadow-2xl shadow-purple-200 border border-purple-200 bg-white/60 backdrop-blur-md"><InterviewPrep /></div>
                  <div className="snap-center shrink-0 w-[700px] h-[320px] flex items-center justify-center rounded-full shadow-2xl shadow-yellow-200 border border-yellow-200 bg-white/60 backdrop-blur-md"><TestSeries /></div>
                </div>
                {/* Right Arrow */}
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Scroll Right"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>
           
            <TestimonialSection />
            <CallToAction />
   
            <Footer />
        </div>
    )
}

export default Home
