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
        </div>
    )
}

export default Home
