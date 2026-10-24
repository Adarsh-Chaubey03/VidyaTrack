import React from 'react'
import Hero from '../../components/student/Hero'
import Feature from '../../components/student/Feature'
import CousreSection from '../../components/student/CousreSection'
import TestimonialSection from '../../components/student/TestimonialSection'
import Footer from '../../components/student/Footer'
import StatsSection from '../../components/student/StatsSection';
import ExtraFeaturesSection from '../../components/student/ExtraFeaturesSection';
import CategoryGrid from '../../components/student/CategoryGrid';
import ChatWidget from '../../components/ai/ChatWidget';

function Home() {
    return (
        <div className='flex flex-col items-center text-center'>
            <Hero />
            {/* Our Top Services — shown immediately after the hero, matching the design */}
            <Feature />
            <StatsSection />
            <CategoryGrid />
            <CousreSection />
            <ExtraFeaturesSection />
            <TestimonialSection />
            <Footer />
            <ChatWidget />
        </div>
    )
}

export default Home
