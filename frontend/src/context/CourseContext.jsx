import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useApi from "../hooks/useApi";
import { getCourseById as getStaticCourseById, courseData } from '../components/CourseData';

// Create context
const CourseContext = createContext(null);

// Course Provider component
export const CourseProvider = ({ children }) => {
  const api = useApi();
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all courses from API and merge with static data
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/courses');
      const apiCourses = response.data.courses || [];
      
      // Merge API courses with static course data for additional fields
      const mergedCourses = apiCourses.map(apiCourse => {
        const staticCourse = getStaticCourseById(apiCourse.slug || apiCourse._id);
        return staticCourse ? { ...staticCourse, ...apiCourse } : apiCourse;
      });
      
      setCourses(mergedCourses);
      return mergedCourses;
    } catch (err) {
      console.warn('API unavailable, using static course data');
      // Fallback to static course data
      const staticCourses = Object.values(courseData);
      setCourses(staticCourses);
      return staticCourses;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get course by ID - checks API courses first, then static data
  const getCourseById = useCallback((courseId) => {
    // First check loaded courses (from API)
    const apiCourse = courses.find(c => 
      c._id === courseId || 
      c.slug === courseId || 
      c.id === courseId
    );
    
    if (apiCourse) return apiCourse;
    
    // Fallback to static course data
    return getStaticCourseById(courseId);
  }, [courses]);

  // Fetch single course by ID from API
  const fetchCourseById = useCallback(async (courseId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/courses/${courseId}`);
      const apiCourse = response.data.course;
      
      // Merge with static data
      const staticCourse = getStaticCourseById(courseId);
      const mergedCourse = staticCourse ? { ...staticCourse, ...apiCourse } : apiCourse;
      
      setCurrentCourse(mergedCourse);
      return mergedCourse;
    } catch (err) {
      // Fallback to static course data
      const staticCourse = getStaticCourseById(courseId);
      if (staticCourse) {
        setCurrentCourse(staticCourse);
        return staticCourse;
      }
      
      const message = err.response?.data?.message || 'Failed to load course.';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enroll in a course
  const enrollInCourse = useCallback(async (courseId, { paymentMethod = 'unknown', transactionId } = {}) => {
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/courses/${courseId}/enroll`,
        { paymentMethod, transactionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to enroll in course.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // Get enrolled courses
  const getEnrolledCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.courses || [];
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load enrolled courses.';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load courses on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const value = {
    courses,
    currentCourse,
    isLoading,
    error,
    fetchCourses,
    fetchCourseById,
    getCourseById,
    enrollInCourse,
    getEnrolledCourses,
    setCurrentCourse,
    clearError: () => setError(null)
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to use course context
export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export default CourseContext;
