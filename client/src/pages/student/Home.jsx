import React from 'react'
import Hero from '../../components/student/Hero'
import Feature from '../../components/student/Feature'
import CousreSection from '../../components/student/CousreSection'
import TestimonialSection from '../../components/student/TestimonialSection'
import CallToAction from '../../components/student/CallToAction'
import Company from '../../components/student/Company'
import Footer from '../../components/student/Footer'

function Home() {
    return (
        <div className='flex flex-col items-center space-y-7 text-center'>
            <Hero />
            <Feature />
            <CousreSection />
            <TestimonialSection />
            <CallToAction />
            <Company />
            <Footer />
        </div>
    )
}

export default Home
