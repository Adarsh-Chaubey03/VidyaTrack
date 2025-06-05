import React from 'react'
import Hero from '../../components/student/Hero'
import Company from '../../components/student/Company'
import CousreSection from '../../components/student/CousreSection'

function Home() {
    return (
        <div className='flex flex-col items-center space-y-7 text-center'>
            <Hero/>
            <Company/>
              <CousreSection/>
           
        </div>
    )
}

export default Home
