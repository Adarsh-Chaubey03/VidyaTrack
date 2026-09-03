import React from 'react'
import Hero from '../../components/student/Hero'
import Feature from '../../components/student/Feature'
import CousreSection from '../../components/student/CousreSection'
import TestimonialSection from '../../components/student/TestimonialSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import StatsSection from '../../components/student/StatsSection';
import ExtraFeaturesSection from '../../components/student/ExtraFeaturesSection';
import CategoryGrid from '../../components/student/CategoryGrid';
import ChatWidget from '../../components/ai/ChatWidget';

function Home() {
    return (
        <div className='flex flex-col items-center  text-center'>
            <Hero />
            <Feature />
            <StatsSection />
            <CategoryGrid />
            <CousreSection />
            <ExtraFeaturesSection />
            <TestimonialSection />
            <CallToAction />

            <Footer />

            {/* Floating study assistant. The chat itself is code-split and only
                downloaded when the bubble is first opened, so the landing page's
                initial payload is unchanged. */}
            <ChatWidget />
        </div>
    )
}

export default Home
