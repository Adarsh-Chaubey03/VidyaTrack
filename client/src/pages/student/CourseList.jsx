import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import { useParams, useNavigate } from 'react-router-dom';

function CourseList() {
    const { educatorCourses } = useContext(AppContext);
    const allCourses = educatorCourses;
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

    return (
        <>
            <div className="px-6 py-10">
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

                    {/* Search Bar */}
                    <div className="w-full md:w-96">
                        <SearchBar data={input || ''} textColor="text-gray-500" inputClassName="placeholder:text-gray-500" />
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
                        <p className="col-span-full text-center text-gray-500">No courses found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CourseList;
