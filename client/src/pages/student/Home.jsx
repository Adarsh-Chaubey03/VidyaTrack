import React from 'react'
import Hero from '../../components/student/Hero'
import Feature from '../../components/student/Feature'
import CousreSection from '../../components/student/CousreSection'
import TestimonialSection from '../../components/student/TestimonialSection'
import CallToAction from '../../components/student/CallToAction'
import Company from '../../components/student/Company'
import Footer from '../../components/student/Footer'
import Mentor from '../../components/student/Mentor'
import ResumeReview from '../../components/student/ResumeReview'
import InterviewPrep from '../../components/student/InterviewPrep'
import TestSeries from '../../components/student/TestSeries'
import arrowIcon from '../../assets/arrow_icon.svg';

function Home() {
    return (
        <div className='flex flex-col items-center space-y-7 text-center'>
            <Hero />
            <Feature />
            <CousreSection />
            {/* Consistent section for extra features with shared bg and circle arrow */}
            <div className="relative py-16 bg-gray-50 overflow-hidden flex flex-col items-center w-full">
              {/* Circle arrow background */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-emerald-100 via-orange-100 to-yellow-100 opacity-60 z-0 flex items-center justify-center">
                <img src={arrowIcon} alt="arrow background" className="w-40 h-40 opacity-40 rotate-[-30deg]" />
              </div>
              {/* Horizontally scrollable cards */}
              <div className="relative z-10 w-full max-w-6xl flex overflow-x-auto gap-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-gray-100 justify-center cursor-grab active:cursor-grabbing">
                <div className="snap-center shrink-0 w-[500px] h-[350px] flex items-center justify-center rounded-3xl shadow-xl bg-white"><Mentor /></div>
                <div className="snap-center shrink-0 w-[500px] h-[350px] flex items-center justify-center rounded-3xl shadow-xl bg-white"><ResumeReview /></div>
                <div className="snap-center shrink-0 w-[500px] h-[350px] flex items-center justify-center rounded-3xl shadow-xl bg-white"><InterviewPrep /></div>
                <div className="snap-center shrink-0 w-[500px] h-[350px] flex items-center justify-center rounded-3xl shadow-xl bg-white"><TestSeries /></div>
              </div>
            </div>
            <TestimonialSection />
            <CallToAction />
            <Company />
            <Footer />
        </div>
    )
}

export default Home
