import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import ScrollRestoration from './components/ScrollRestoration';
import Navbar from './components/student/Navbar';
import Loading from './components/student/Loading';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { SkeletonLogin, SkeletonSignup } from './components/skeleton/Skeleton';

// Eagerly loaded – landing page (first paint)
import Home from './pages/student/Home';

// Lazy-loaded pages – split into separate chunks
const CourseList = lazy(() => import('./pages/student/CourseList'));
const MyDashboard = lazy(() => import('./pages/student/MyDashboard'));
const CourseDetails = lazy(() => import('./pages/student/CourseDetails'));
const Player = lazy(() => import('./pages/student/Player'));
const Mentor = lazy(() => import('./pages/student/Mentor'));
const MentorProfile = lazy(() => import('./pages/student/MentorProfile'));
const AIcareerCopilot = lazy(() => import('./pages/student/AIcareerCopilot'));

// Resume system
const ResumeHub = lazy(() => import('./pages/student/resume/ResumeHub'));
const ResumeBuilder = lazy(() => import('./pages/student/resume/ResumeBuilder'));
const ReviewRequest = lazy(() => import('./pages/student/resume/ReviewRequest'));
const ContactUs = lazy(() => import('./pages/student/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/student/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/student/TermsAndConditions'));
const FAQs = lazy(() => import('./pages/student/FAQs'));
const Feedback = lazy(() => import('./pages/student/Feedback'));
const RequestFeature = lazy(() => import('./pages/student/RequestFeature'));
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const RoleSwitchConfirm = lazy(() => import('./pages/RoleSwitchConfirm'));

// Educator Access flow
const EducatorAccess = lazy(() => import('./pages/student/EducatorAccess'));
const EducatorLogin = lazy(() => import('./pages/student/EducatorLogin'));
const EducatorApplicationForm = lazy(() => import('./pages/student/EducatorApplicationForm'));

// Educator panel
const Educator = lazy(() => import('./pages/educator/Educator'));
const EducatorLayout = lazy(() => import('./layouts/EducatorLayout'));
const Dashboard = lazy(() => import('./pages/educator/Dashboard'));
const MyCourses = lazy(() => import('./pages/educator/MyCourses'));
const AddCourse = lazy(() => import('./pages/educator/AddCourse'));
const StudentEnrolled = lazy(() => import('./pages/educator/StudentEnrolled'));
const AdminApplications = lazy(() => import('./pages/educator/AdminApplications'));

// Blog pages
const BlogList = lazy(() => import('./pages/student/BlogList'));
const BlogDetail = lazy(() => import('./pages/student/BlogDetail'));
const BlogSubmit = lazy(() => import('./pages/student/BlogSubmit'));
const MyPosts = lazy(() => import('./pages/student/MyPosts'));
const AdminBlogQueue = lazy(() => import('./pages/educator/AdminBlogQueue'));

const App = () => {
  const location = useLocation();
  const isEducatorRoute = location.pathname.startsWith('/educator');
  const isStandalonePage = location.pathname === '/switch-role';



  return (
    <div className='text-default min-h-screen bg-white'>
      <ScrollRestoration />
      {!isEducatorRoute && !isStandalonePage && <Navbar />}

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/course-list' element={<CourseList />} />
          <Route path='/course-list/:input' element={<CourseList />} />
          <Route path='/course/:id' element={<CourseDetails />} />
          <Route path='/my-enrollment' element={<Navigate to="/my-dashboard" replace />} />
          <Route path='/my-dashboard' element={
            <ProtectedRoute>
              <MyDashboard />
            </ProtectedRoute>
          } />
          <Route path='/player/:courseId' element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          } />
          <Route path='/loading/:path' element={<Loading />} />
          <Route path='/mentor' element={<Mentor />} />
          <Route path='/ai-career-copilot' element={<AIcareerCopilot />} />

          {/* Resume System */}
          <Route path='/resume' element={<ResumeHub />} />
          <Route path='/resume/builder' element={<ResumeBuilder />} />
          <Route path='/resume/review' element={<ReviewRequest />} />
          {/* Legacy redirects */}
          <Route path='/resumereview' element={<Navigate to="/resume" replace />} />
          <Route path='/generateresume' element={<Navigate to="/resume/builder" replace />} />
          <Route path='/getreviewed' element={<Navigate to="/resume/review" replace />} />
          <Route path='/getreviewed/:id' element={<Navigate to="/resume/review" replace />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={<TermsAndConditions />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/request-feature' element={<RequestFeature />} />
          <Route path='/mentor/:id' element={<MentorProfile />} />

          {/* Blog Routes */}
          <Route path='/blog' element={<BlogList />} />
          <Route path='/blog/:slug' element={<BlogDetail />} />
          <Route path='/blog/submit' element={
            <ProtectedRoute>
              <BlogSubmit />
            </ProtectedRoute>
          } />
          <Route path='/blog/my-posts' element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          } />

          {/* Auth Routes */}
          <Route path='/login' element={
            <Suspense fallback={<SkeletonLogin />}>
              <Login />
            </Suspense>
          } />
          <Route path='/signup' element={
            <Suspense fallback={<SkeletonSignup />}>
              <Signup />
            </Suspense>
          } />
          <Route path='/switch-role' element={<RoleSwitchConfirm />} />

          {/* Educator Access Flow (public / student-accessible) */}
          <Route path='/educator-access' element={<EducatorAccess />} />
          <Route path='/educator-access/login' element={<EducatorLogin />} />
          <Route path='/educator-access/apply' element={
            <ProtectedRoute>
              <EducatorApplicationForm />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path='/admin/applications' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminApplications />
            </ProtectedRoute>
          } />
          <Route path='/admin/blog-queue' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminBlogQueue />
            </ProtectedRoute>
          } />

          {/* Educator Routes with Authentication Check */}
          <Route path='/educator' element={
            <ProtectedRoute requireEducator={true}>
              <Educator />
            </ProtectedRoute>
          }>
            <Route element={<EducatorLayout />}>
              <Route index element={<Dashboard />} />
              <Route path='my-courses' element={<MyCourses />} />
              <Route path='add-courses' element={<AddCourse />} />
              <Route path='student-enrolled' element={<StudentEnrolled />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
