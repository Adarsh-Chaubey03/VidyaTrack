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
  async (config) => {
    // For Clerk, we need to ensure the session cookie is included
    config.withCredentials = true;
    
    // Add Authorization header with Bearer token if available
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('No Clerk token available');
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
      // Handle unauthorized access - don't redirect automatically
      console.warn('Unauthorized access detected, but not redirecting');
      // Only redirect if explicitly needed
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);



// API endpoints
export const API_ENDPOINTS = {
  // Course endpoints
  COURSES: {
    ALL: '/course/all',
    BY_ID: (id) => `/course/${id}`,
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
    CREATE_PAYMENT_INTENT: '/user/create-payment-intent',
  },
  
  // Educator endpoints
  EDUCATOR: {
    DASHBOARD: '/educator/dashboard',
    COURSES: '/educator/courses',
    ADD_COURSE: '/educator/add-course',
    STUDENTS: '/educator/students',
  },
};

// API service functions
export const apiService = {
  // Course services
  courses: {
    getAll: async () => {
      const response = await api.get(API_ENDPOINTS.COURSES.ALL);
      return response.data;
    },
    
    getById: async (id) => {
      const response = await api.get(API_ENDPOINTS.COURSES.BY_ID(id));
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

    createPaymentIntent: async (data) => {
      const response = await api.post(API_ENDPOINTS.USER.CREATE_PAYMENT_INTENT, data);
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