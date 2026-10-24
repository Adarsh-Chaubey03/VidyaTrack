import React from 'react'
import Hero from '../../components/student/Hero'
import Feature from '../../components/student/Feature'
import TestimonialSection from '../../components/student/TestimonialSection'
import Footer from '../../components/student/Footer'
import StatsSection from '../../components/student/StatsSection';
import ExtraFeaturesSection from '../../components/student/ExtraFeaturesSection';
import ExploreCategories from '../../components/student/ExploreCategories';
import ChatWidget from '../../components/ai/ChatWidget';

function Home() {
    return (
        <div className='flex flex-col items-center text-center'>
            <Hero />
            <Feature />
            <StatsSection />
            <ExploreCategories />
            <ExtraFeaturesSection />
            <TestimonialSection />
            <Footer />
            <ChatWidget />
        </div>
    )
}

export default Home
