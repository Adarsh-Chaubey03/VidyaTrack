import React from 'react'
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

function Preview() {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (user) {
            navigate('/educator');
        } else {
            openSignIn();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-white">
            {/* Top left back to student button */}
            <div className="absolute top-4 left-4 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 bg-white text-emerald-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-emerald-50 border border-emerald-200 transition"
                >
                    <span className="text-xl">&#8592;</span> {/* Unicode left arrow */}
                    <span>Student</span>
                </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="max-w-3xl w-full text-center">
                    <img src={assets.eduLogo} alt="Educator Logo" className="mx-auto w-32 mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Empower Learners. Build Your Career.</h1>
                    <p className="text-lg text-gray-600 mb-8">Join VidyaTrack as an educator and unlock a world of opportunities. Share your expertise, inspire students, and grow your professional brand with our powerful tools and supportive community.</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
                        <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 w-full md:w-64">
                            <img src={assets.add_icon} alt="Add Course" className="w-10 h-10 mb-2" />
                            <h3 className="font-semibold text-lg mb-1">Create Courses</h3>
                            <p className="text-gray-500 text-sm">Design and publish engaging courses with ease using our intuitive platform.</p>
                        </div>
                        <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 w-full md:w-64">
                            <img src={assets.person_tick_icon} alt="Mentor" className="w-10 h-10 mb-2" />
                            <h3 className="font-semibold text-lg mb-1">Mentor Students</h3>
                            <p className="text-gray-500 text-sm">Guide learners, answer questions, and make a real impact on their careers.</p>
                        </div>
                        <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 w-full md:w-64">
                            <img src={assets.earning_icon} alt="Earn" className="w-10 h-10 mb-2" />
                            <h3 className="font-semibold text-lg mb-1">Grow & Earn</h3>
                            <p className="text-gray-500 text-sm">Expand your reach, build your brand, and earn for your expertise.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleGetStarted}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition"
                    >
                        Get Started as Educator
                    </button>
                    <p className="text-gray-400 text-sm mt-4">You must be logged in as an educator to access the dashboard.</p>
                </div>
            </div>
        </div>
    )
}

export default Preview
