import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api`,
  timeout: 30000, // 30s — accounts for Vercel serverless cold starts
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add Authorization header with Bearer token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData, let the browser set the Content-Type automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints that should NEVER trigger the 401 auto-redirect
// (their own callers handle errors explicitly)
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/educator-login', '/educator-access/login'];

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthRequest = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep));

    // Only auto-redirect on 401 for NON-auth requests (i.e. expired session)
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);



// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    EDUCATOR_LOGIN: '/auth/educator-login',
    ME: '/auth/me',
  },

  // Course endpoints
  COURSES: {
    ALL: '/course/all',
    CATEGORIES: '/course/categories',
    BY_ID: (id) => `/course/${id}`,
    ENROLLED_BY_ID: (id) => `/course/enrolled/${id}`,
  },

  // Progress endpoints
  PROGRESS: {
    GET: (userId, courseId) => `/progress/${userId}/${courseId}`,
    UPDATE_LECTURE: (userId, courseId, chapterId, lectureId) =>
      `/progress/${userId}/${courseId}/${chapterId}/${lectureId}`,
    UPDATE_WATCH_TIME: (userId, courseId, chapterId, lectureId) =>
      `/progress/${userId}/${courseId}/${chapterId}/${lectureId}/watchtime`,
    USER_PROGRESS: (userId) => `/progress/user/${userId}`,
    RESET: (userId, courseId) => `/progress/${userId}/${courseId}`,
    ANALYTICS: (courseId) => `/progress/analytics/${courseId}`,
  },

  // User endpoints
  USER: {
    PROFILE: '/user/data',
    UPDATE: '/user/update',
    PURCHASE_COURSE: '/user/purchase-course',
    ENROLL_FREE_COURSE: '/user/enroll-free-course',
  },

  // Educator endpoints
  EDUCATOR: {
    DASHBOARD: '/educator/dashboard',
    COURSES: '/educator/courses',
    ADD_COURSE: '/educator/add-course',
    STUDENTS: '/educator/enrolledStudent',
  },

  // Educator Access / Application endpoints
  EDUCATOR_ACCESS: {
    LOGIN: '/educator-access/login',
    APPLY: '/educator-access/apply',
    STATUS: '/educator-access/status',
    SWITCH_TO_STUDENT: '/educator-access/switch-to-student',
    ADMIN_APPLICATIONS: '/educator-access/admin/applications',
    ADMIN_REVIEW: (id) => `/educator-access/admin/review/${id}`,
    ADMIN_STATS: '/educator-access/admin/stats',
  },

  // Razorpay payment endpoints (replicated from vendor-dashboard pattern)
  PAYMENTS: {
    CREATE_ORDER: '/payments/create-order',
    CONFIRM: '/payments/confirm',
    STATUS: (transactionId) => `/payments/status/${transactionId}`,
    HISTORY: '/payments/history',
  },

  // Blog / Posts endpoints
  BLOG: {
    LIST: '/posts',
    DETAIL: (slug) => `/posts/detail/${slug}`,
    SUBMIT: '/posts/submit',
    UPDATE: (id) => `/posts/${id}`,
    MY_POSTS: '/posts/me/list',
    UPLOAD_IMAGE: '/posts/upload-image',
    COMMENTS: (postId) => `/posts/${postId}/comments`,
    FLAG_COMMENT: (commentId) => `/posts/comments/${commentId}/flag`,
    ADMIN_LIST: '/posts/admin/list',
    ADMIN_APPROVE: (id) => `/posts/admin/${id}/approve`,
    ADMIN_REJECT: (id) => `/posts/admin/${id}/reject`,
    ADMIN_COMMENTS: '/posts/admin/comments',
    ADMIN_APPROVE_COMMENT: (id) => `/posts/admin/comments/${id}/approve`,
    ADMIN_DELETE_COMMENT: (id) => `/posts/admin/comments/${id}`,
  },

};

// API service functions
export const apiService = {
  // Auth services
  auth: {
    login: async (data) => {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
      return response.data;
    },

    register: async (data) => {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
      return response.data;
    },

    educatorLogin: async (data) => {
      const response = await api.post(API_ENDPOINTS.AUTH.EDUCATOR_LOGIN, data);
      return response.data;
    },

    getMe: async () => {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    },
  },

  // Course services
  courses: {
    getAll: async (params = {}) => {
      const response = await api.get(API_ENDPOINTS.COURSES.ALL, { params });
      return response.data;
    },

    getCategories: async () => {
      const response = await api.get(API_ENDPOINTS.COURSES.CATEGORIES);
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(API_ENDPOINTS.COURSES.BY_ID(id));
      return response.data;
    },

    getEnrolledById: async (id) => {
      const response = await api.get(API_ENDPOINTS.COURSES.ENROLLED_BY_ID(id));
      return response.data;
    },
  },

  // Progress services
  progress: {
    get: async (userId, courseId) => {
      const response = await api.get(API_ENDPOINTS.PROGRESS.GET(userId, courseId));
      return response.data;
    },

    updateLecture: async (userId, courseId, chapterId, lectureId, data) => {
      const response = await api.put(
        API_ENDPOINTS.PROGRESS.UPDATE_LECTURE(userId, courseId, chapterId, lectureId),
        data
      );
      return response.data;
    },

    updateWatchTime: async (userId, courseId, chapterId, lectureId, data) => {
      const response = await api.patch(
        API_ENDPOINTS.PROGRESS.UPDATE_WATCH_TIME(userId, courseId, chapterId, lectureId),
        data
      );
      return response.data;
    },

    getUserProgress: async (userId) => {
      const response = await api.get(API_ENDPOINTS.PROGRESS.USER_PROGRESS(userId));
      return response.data;
    },

    reset: async (userId, courseId) => {
      const response = await api.delete(API_ENDPOINTS.PROGRESS.RESET(userId, courseId));
      return response.data;
    },

    getAnalytics: async (courseId) => {
      const response = await api.get(API_ENDPOINTS.PROGRESS.ANALYTICS(courseId));
      return response.data;
    },
  },

  // User services
  user: {
    getProfile: async () => {
      const response = await api.get(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    },

    updateProfile: async (data) => {
      const response = await api.put(API_ENDPOINTS.USER.UPDATE, data);
      return response.data;
    },

    purchaseCourse: async (data) => {
      const response = await api.post(API_ENDPOINTS.USER.PURCHASE_COURSE, data);
      return response.data;
    },

    enrollFreeCourse: async (data) => {
      const response = await api.post(API_ENDPOINTS.USER.ENROLL_FREE_COURSE, data);
      return response.data;
    },
  },

  // Educator services
  educator: {
    getDashboard: async () => {
      const response = await api.get(API_ENDPOINTS.EDUCATOR.DASHBOARD);
      return response.data;
    },

    getCourses: async () => {
      const response = await api.get(API_ENDPOINTS.EDUCATOR.COURSES);
      return response.data;
    },

    addCourse: async (data) => {
      const response = await api.post(API_ENDPOINTS.EDUCATOR.ADD_COURSE, data);
      return response.data;
    },

    getStudents: async () => {
      const response = await api.get(API_ENDPOINTS.EDUCATOR.STUDENTS);
      return response.data;
    },
  },

  // Educator Access services
  educatorAccess: {
    login: async (data) => {
      const response = await api.post(API_ENDPOINTS.EDUCATOR_ACCESS.LOGIN, data);
      return response.data;
    },

    apply: async (formData) => {
      const response = await api.post(API_ENDPOINTS.EDUCATOR_ACCESS.APPLY, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    getStatus: async () => {
      const response = await api.get(API_ENDPOINTS.EDUCATOR_ACCESS.STATUS);
      return response.data;
    },

    switchToStudent: async () => {
      const response = await api.post(API_ENDPOINTS.EDUCATOR_ACCESS.SWITCH_TO_STUDENT);
      return response.data;
    },

    // Admin
    getApplications: async (status) => {
      const params = status ? { status } : {};
      const response = await api.get(API_ENDPOINTS.EDUCATOR_ACCESS.ADMIN_APPLICATIONS, { params });
      return response.data;
    },

    reviewApplication: async (id, data) => {
      const response = await api.put(API_ENDPOINTS.EDUCATOR_ACCESS.ADMIN_REVIEW(id), data);
      return response.data;
    },

    getStats: async () => {
      const response = await api.get(API_ENDPOINTS.EDUCATOR_ACCESS.ADMIN_STATS);
      return response.data;
    },
  },

  // Blog services
  blog: {
    listPublished: async (params = {}) => {
      const response = await api.get(API_ENDPOINTS.BLOG.LIST, { params });
      return response.data;
    },

    getBySlug: async (slug) => {
      const response = await api.get(API_ENDPOINTS.BLOG.DETAIL(slug));
      return response.data;
    },

    submit: async (data) => {
      const response = await api.post(API_ENDPOINTS.BLOG.SUBMIT, data);
      return response.data;
    },

    update: async (id, data) => {
      const response = await api.put(API_ENDPOINTS.BLOG.UPDATE(id), data);
      return response.data;
    },

    myPosts: async () => {
      const response = await api.get(API_ENDPOINTS.BLOG.MY_POSTS);
      return response.data;
    },

    uploadImage: async (formData) => {
      const response = await api.post(API_ENDPOINTS.BLOG.UPLOAD_IMAGE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // Comments
    getComments: async (postId, params = {}) => {
      const response = await api.get(API_ENDPOINTS.BLOG.COMMENTS(postId), { params });
      return response.data;
    },

    addComment: async (postId, data) => {
      const response = await api.post(API_ENDPOINTS.BLOG.COMMENTS(postId), data);
      return response.data;
    },

    flagComment: async (commentId) => {
      const response = await api.post(API_ENDPOINTS.BLOG.FLAG_COMMENT(commentId));
      return response.data;
    },

    // Admin
    adminList: async (params = {}) => {
      const response = await api.get(API_ENDPOINTS.BLOG.ADMIN_LIST, { params });
      return response.data;
    },

    adminApprove: async (id) => {
      const response = await api.post(API_ENDPOINTS.BLOG.ADMIN_APPROVE(id));
      return response.data;
    },

    adminReject: async (id, reason) => {
      const response = await api.post(API_ENDPOINTS.BLOG.ADMIN_REJECT(id), { reason });
      return response.data;
    },

    adminListComments: async (params = {}) => {
      const response = await api.get(API_ENDPOINTS.BLOG.ADMIN_COMMENTS, { params });
      return response.data;
    },

    adminApproveComment: async (id) => {
      const response = await api.post(API_ENDPOINTS.BLOG.ADMIN_APPROVE_COMMENT(id));
      return response.data;
    },

    adminDeleteComment: async (id) => {
      const response = await api.delete(API_ENDPOINTS.BLOG.ADMIN_DELETE_COMMENT(id));
      return response.data;
    },
  },
};

export default api; 