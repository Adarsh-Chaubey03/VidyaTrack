import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets'; // Make sure this path is correct

function CourseDetails() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const { allCourses, rating = 4.2, totalRatings = 189 } = useContext(AppContext); // Defaults if not passed

  useEffect(() => {
    const fetchCourseData = () => {
      const findCourse = allCourses.find(course => course._id === id);
      setCourseData(findCourse);
    };
    fetchCourseData();
  }, [allCourses, id]);

  // Rating logic
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <>
      {courseData ? (
        <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
          {/* Background Layer */}
          <div className="absolute top-0 left-0 w-full h-[500px] -z-10 bg-gradient-to-b from-emerald-100/70"></div>

          {/* Left Column */}
          <div className="max-w-3xl z-10 text-gray-700 space-y-6 bg-white/50 ">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight tracking-tight">
              {courseData.courseTitle}
            </h1>
            <p
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0,270) }}
              className="text-lg leading-relaxed tracking-wide text-gray-700"
            ></p>

            {/* Rating Section */}
            <div className="flex items-center gap-2 pt-2 text-gray-700 text-sm">
              <span className="text-red-600 font-semibold">{rating.toFixed(1)}</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => {
                  if (i < fullStars) {
                    return <img key={i} src={assets.star} alt="star" className="w-4 h-4" />;
                  } else if (i === fullStars && hasHalfStar) {
                    return <img key={i} src={assets.star_half} alt="half star" className="w-4 h-4" />;
                  } else {
                    return <img key={i} src={assets.star_blank} alt="empty star" className="w-4 h-4" />;
                  }
                })}
              </div>
              <span className="text-emerald-500">({totalRatings})</span>
              <p >{courseData.enrolledStudents.length}{courseData.enrolledStudents.length>1 ? ' students' : ' student'}</p>
            </div>
            <p>Course By <span className='text-emerald-600 underline'>VidyaTrack</span></p>
          </div>

          {/* Right Column */}
          <div>{/* Add sidebar, video preview, or any other component here */}</div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default CourseDetails;
