import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear token and redirect to login
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
    STUDENTS: '/educator/students',
  },

  // Razorpay payment endpoints (replicated from vendor-dashboard pattern)
  PAYMENTS: {
    CREATE_ORDER: '/payments/create-order',
    CONFIRM: '/payments/confirm',
    STATUS: (transactionId) => `/payments/status/${transactionId}`,
    HISTORY: '/payments/history',
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
};

export default api; 