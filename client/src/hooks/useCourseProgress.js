import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiService } from '../services/api.js';

export const useCourseProgress = (courseId) => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useAuth();

    const fetchProgress = useCallback(async () => {
        if (!userId || !courseId) return;

        try {
            setLoading(true);
            setError(null);
            
            const result = await apiService.progress.get(userId, courseId);
            
            if (result.success) {
                setProgress(result.progress);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch progress');
            console.error('Error fetching progress:', err);
        } finally {
            setLoading(false);
        }
    }, [userId, courseId]);

    const updateLectureProgress = useCallback(async (chapterId, lectureId, isCompleted) => {
        if (!userId || !courseId) return;

        try {
            setError(null);
            
            const result = await apiService.progress.updateLecture(
                userId, 
                courseId, 
                chapterId, 
                lectureId, 
                { isCompleted }
            );
            
            if (result.success) {
                setProgress(result.progress);
                return { success: true, progress: result.progress };
            } else {
                setError(result.message);
                return { success: false, error: result.message };
            }
        } catch (err) {
            const errorMsg = 'Failed to update progress';
            setError(errorMsg);
            console.error('Error updating lecture progress:', err);
            return { success: false, error: errorMsg };
        }
    }, [userId, courseId]);

    const updateWatchTime = useCallback(async (chapterId, lectureId, watchTime, totalWatchTime) => {
        if (!userId || !courseId) return;

        try {
            const result = await apiService.progress.updateWatchTime(
                userId, 
                courseId, 
                chapterId, 
                lectureId, 
                { watchTime, totalWatchTime }
            );
            
            if (result.success) {
                setProgress(result.progress);
                return { success: true, progress: result.progress };
            } else {
                return { success: false, error: result.message };
            }
        } catch (err) {
            console.error('Failed to update watch time:', err);
            return { success: false, error: 'Failed to update watch time' };
        }
    }, [userId, courseId]);

    const resetProgress = useCallback(async () => {
        if (!userId || !courseId) return;

        try {
            setError(null);
            
            const result = await apiService.progress.reset(userId, courseId);
            
            if (result.success) {
                setProgress(result.progress);
                return { success: true, progress: result.progress };
            } else {
                setError(result.message);
                return { success: false, error: result.message };
            }
        } catch (err) {
            const errorMsg = 'Failed to reset progress';
            setError(errorMsg);
            console.error('Error resetting progress:', err);
            return { success: false, error: errorMsg };
        }
    }, [userId, courseId]);

    const getUserAllProgress = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            
            const result = await apiService.progress.getUserProgress(userId);
            
            if (result.success) {
                return { success: true, progress: result.progress };
            } else {
                setError(result.message);
                return { success: false, error: result.message };
            }
        } catch (err) {
            const errorMsg = 'Failed to fetch user progress';
            setError(errorMsg);
            console.error('Error fetching user progress:', err);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId && courseId) {
            fetchProgress();
        }
    }, [userId, courseId, fetchProgress]);

    return {
        progress,
        loading,
        error,
        fetchProgress,
        updateLectureProgress,
        updateWatchTime,
        resetProgress,
        getUserAllProgress
    };
}; 