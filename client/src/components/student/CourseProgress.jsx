import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiService } from '../../services/api.js';

const CourseProgress = ({ courseId, onProgressUpdate }) => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useAuth();

    const fetchProgress = async () => {
        try {
            setLoading(true);
            const result = await apiService.progress.get(userId, courseId);
            
            if (result.success) {
                setProgress(result.progress);
                if (onProgressUpdate) {
                    onProgressUpdate(result.progress);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch progress');
            console.error('Error fetching progress:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateLectureProgress = async (chapterId, lectureId, isCompleted) => {
        try {
            const result = await apiService.progress.updateLecture(
                userId, 
                courseId, 
                chapterId, 
                lectureId, 
                { isCompleted }
            );
            
            if (result.success) {
                setProgress(result.progress);
                if (onProgressUpdate) {
                    onProgressUpdate(result.progress);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to update progress');
            console.error('Error updating progress:', err);
        }
    };

    const updateWatchTime = async (chapterId, lectureId, watchTime, totalWatchTime) => {
        try {
            await apiService.progress.updateWatchTime(
                userId, 
                courseId, 
                chapterId, 
                lectureId, 
                { watchTime, totalWatchTime }
            );
        } catch (err) {
            console.error('Failed to update watch time:', err);
        }
    };

    useEffect(() => {
        if (userId && courseId) {
            fetchProgress();
        }
    }, [userId, courseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        );
    }

    if (!progress) {
        return null;
    }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
                <span className="text-sm text-gray-500">
                    {progress.completedLectures} / {progress.totalLectures} lectures
                </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-semibold text-blue-600">
                        {progress.progressPercentage}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Watch Time</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {formatTime(progress.totalWatchTime)}
                    </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Last Accessed</p>
                    <p className="text-sm font-medium text-gray-900">
                        {new Date(progress.lastAccessedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Chapter Progress */}
            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Chapter Progress</h4>
                {progress.chapterProgress.map((chapter, chapterIndex) => (
                    <div key={chapter.chapterId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">Chapter {chapterIndex + 1}</h5>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                                chapter.isCompleted 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {chapter.isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                            {chapter.completedLectures.map((lecture, lectureIndex) => (
                                <div key={lecture.lectureId} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => updateLectureProgress(
                                                chapter.chapterId, 
                                                lecture.lectureId, 
                                                !lecture.isCompleted
                                            )}
                                            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                                lecture.isCompleted 
                                                    ? 'bg-blue-600 border-blue-600' 
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            {lecture.isCompleted && (
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                        <span className={`text-sm ${
                                            lecture.isCompleted ? 'text-gray-900' : 'text-gray-600'
                                        }`}>
                                            Lecture {lectureIndex + 1}
                                        </span>
                                    </div>
                                    {lecture.watchTime > 0 && (
                                        <span className="text-xs text-gray-500">
                                            {formatTime(lecture.watchTime)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Course Completion Status */}
            {progress.isCompleted && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 font-medium">Course Completed!</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                        Completed on {new Date(progress.completedAt).toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CourseProgress; 