import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

export const useCourseProgress = (courseId) => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useAuth();

    const getToken = useCallback(async () => {
        // This would be implemented based on your Clerk setup
        return localStorage.getItem('clerk-token') || '';
    }, []);

    const fetchProgress = useCallback(async () => {
        if (!userId || !courseId) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`/api/progress/${userId}/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProgress(data.progress);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch progress');
        } finally {
            setLoading(false);
        }
    }, [userId, courseId, getToken]);

    const updateLectureProgress = useCallback(async (chapterId, lectureId, isCompleted) => {
        if (!userId || !courseId) return;

        try {
            setError(null);
            
            const response = await fetch(`/api/progress/${userId}/${courseId}/${chapterId}/${lectureId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isCompleted })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProgress(data.progress);
                return { success: true, progress: data.progress };
            } else {
                setError(data.message);
                return { success: false, error: data.message };
            }
        } catch (err) {
            const errorMsg = 'Failed to update progress';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, [userId, courseId, getToken]);

    const updateWatchTime = useCallback(async (chapterId, lectureId, watchTime, totalWatchTime) => {
        if (!userId || !courseId) return;

        try {
            const response = await fetch(`/api/progress/${userId}/${courseId}/${chapterId}/${lectureId}/watchtime`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ watchTime, totalWatchTime })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProgress(data.progress);
                return { success: true, progress: data.progress };
            } else {
                return { success: false, error: data.message };
            }
        } catch (err) {
            console.error('Failed to update watch time:', err);
            return { success: false, error: 'Failed to update watch time' };
        }
    }, [userId, courseId, getToken]);

    const resetProgress = useCallback(async () => {
        if (!userId || !courseId) return;

        try {
            setError(null);
            
            const response = await fetch(`/api/progress/${userId}/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProgress(data.progress);
                return { success: true, progress: data.progress };
            } else {
                setError(data.message);
                return { success: false, error: data.message };
            }
        } catch (err) {
            const errorMsg = 'Failed to reset progress';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, [userId, courseId, getToken]);

    const getUserAllProgress = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`/api/progress/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                return { success: true, progress: data.progress };
            } else {
                setError(data.message);
                return { success: false, error: data.message };
            }
        } catch (err) {
            const errorMsg = 'Failed to fetch user progress';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [userId, getToken]);

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