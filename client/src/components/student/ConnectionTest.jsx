import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api.js';

const ConnectionTest = () => {
    const [status, setStatus] = useState('Testing...');
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        try {
            setStatus('Testing backend connection...');
            
            // Test basic API connection
            const result = await apiService.courses.getAll();
            
            if (result.success) {
                setStatus('✅ Backend connection successful!');
                setCourses(result.courses || []);
            } else {
                setStatus('❌ Backend connection failed');
                setError(result.message);
            }
        } catch (err) {
            setStatus('❌ Backend connection failed');
            setError(err.message);
            console.error('Connection test error:', err);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Backend-Frontend Connection Test
            </h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Connection Status:</span>
                    <span className={`text-sm font-semibold ${
                        status.includes('✅') ? 'text-green-600' : 
                        status.includes('❌') ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                        {status}
                    </span>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {courses.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-700 text-sm font-medium">
                            ✅ Successfully fetched {courses.length} courses from backend
                        </p>
                    </div>
                )}

                <button
                    onClick={testConnection}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Test Connection Again
                </button>

                <div className="text-xs text-gray-500 text-center">
                    This component tests the API connection between frontend and backend.
                    If you see a green checkmark, the connection is working properly.
                </div>
            </div>
        </div>
    );
};

export default ConnectionTest; 