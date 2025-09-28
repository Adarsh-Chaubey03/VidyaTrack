import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../../components/student/Loading';

function CourseList() {
    const { allCourses, loading, refreshCourses } = useContext(AppContext);
    const navigate = useNavigate();
    const { input } = useParams();
    const [filteredCourse, setFilteredCourse] = useState([]);

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = allCourses.slice();
            if (input) {
                const filtered = tempCourses.filter((item) =>
                    item.courseTitle.toLowerCase().includes(input.toLowerCase())
                );
                setFilteredCourse(filtered);
            } else {
                setFilteredCourse(tempCourses);
            }
        }
    }, [allCourses, input]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bg-gradient-to-b from-emerald-50 to-rose-50 min-h-screen flex flex-col">
            <div className="px-6 py-10 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    {/* Title & Breadcrumb */}
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">Course List</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            <span
                                className="text-emerald-600 cursor-pointer hover:underline"
                                onClick={() => navigate('/')}
                            >
                                Home
                            </span>
                            <span className="mx-1">/</span>
                            <span>Course List</span>
                        </p>
                    </div>

                    {/* Search Bar and Refresh Button */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="flex-1 md:w-96">
                            <SearchBar data={input || ''} textColor="text-gray-500" inputClassName="placeholder:text-gray-500" />
                        </div>
                        <button
                            onClick={refreshCourses}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Clear Input Tag */}
                {input && (
                    <div className="inline-flex items-center px-4 py-2 border mb-8 text-gray-600 rounded-md">
                        <p className="mr-2">Search: <strong>{input}</strong></p>
                        <img
                            src={assets.cross_icon}
                            alt="Clear Search"
                            className="cursor-pointer w-4 h-4"
                            onClick={() => navigate("/course-list")}
                        />
                    </div>
                )}

                

                {/* Course Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-6">
                    {filteredCourse.length > 0 ? (
                        filteredCourse.map((course, index) => (
                            <CourseCard key={index} course={course} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">No courses found.</p>
                            {input && (
                                <button 
                                    onClick={() => navigate("/course-list")}
                                    className="text-emerald-600 hover:underline"
                                >
                                    Clear search and view all courses
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CourseList;
