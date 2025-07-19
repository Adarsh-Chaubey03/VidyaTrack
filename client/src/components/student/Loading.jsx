import React from 'react'

function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-rose-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Courses...</h2>
                <p className="text-gray-500">Please wait while we fetch the latest courses</p>
            </div>
        </div>
    )
}

export default Loading
