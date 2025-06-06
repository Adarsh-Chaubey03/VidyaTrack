import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CousreCard';

function CourseList() {
    const { navigate, input, filteredCourse } = useContext(AppContext); 

    return (
        <div className="px-6 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                {/* Left: Title & Breadcrumb */}
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

                {/* Right: Search Bar */}
                <div className="w-full md:w-96">
                    <SearchBar data={input} />
                </div>
            </div>

            {/* Course Cards Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-6 '>
                {filteredCourse?.map((course, index) => (
                    <CourseCard key={index} course={course}/>
                ))}
            </div>
        </div>
    );
}

export default CourseList;
