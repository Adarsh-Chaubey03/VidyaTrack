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
import ExtraFeaturesSection from '../../components/student/ExtraFeaturesSection';

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
            <ExtraFeaturesSection />
           
            <TestimonialSection />
            <CallToAction />
   
            <Footer />
        </div>
    )
}

export default Home
