import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/student/Home';
import CourseList from './pages/student/CourseList';
import MyEnrollment from './pages/student/MyEnrollment';
import CourseDetails from './pages/student/CourseDetails';
import Player from './pages/student/Player';
import Loading from './components/student/Loading';
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import MyCourses from './pages/educator/MyCourses';
import AddCourse from './pages/educator/AddCourse';
import StudentEnrolled from './pages/educator/StudentEnrolled';
import Navbar from './components/student/Navbar';
import EducatorLayout from './layouts/EducatorLayout';
import Mentor from './pages/student/Mentor';
import ResumeReview from './pages/student/ResumeReview';
import Interview from './pages/student/Interview';
import TestSeries from './pages/student/TestSeries';

const App = () => {
  const location = useLocation();
  const isEducatorRoute = location.pathname.startsWith('/educator');

  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CourseList />} />
        <Route path='/course-list/:input' element={<CourseList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollment' element={<MyEnrollment/>}/>
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />
        <Route path='/mentor' element={<Mentor />} />
        <Route path='/resumereview' element={<ResumeReview />} />
        <Route path='/interview' element={<Interview />} />
        <Route path='/testseries' element={<TestSeries />} />

        {/* Educator Routes with Authentication Check */}
        <Route path='/educator' element={<Educator />}>
          <Route element={<EducatorLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='my-courses' element={<MyCourses />} />
            <Route path='add-courses' element={<AddCourse />} />
            <Route path='student-enrolled' element={<StudentEnrolled />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
