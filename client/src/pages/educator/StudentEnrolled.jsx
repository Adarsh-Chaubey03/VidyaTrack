import React, { useEffect, useState } from 'react'
import { apiService } from '../../services/api'
import { Users, AlertCircle, RefreshCw, Calendar } from 'lucide-react'
import { SkeletonStudentEnrolled } from '../../components/skeleton/Skeleton'

function StudentEnrolled() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchStudents = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await apiService.educator.getStudents()
            if (result.success) {
                setStudents(result.enrolledStudents || [])
            } else {
                setError(result.message || 'Failed to load students')
            }
        } catch (err) {
            setError('Unable to connect to server')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    // Loading skeleton
    if (loading) {
        return <SkeletonStudentEnrolled />
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">Failed to load students</h3>
                <p className="text-sm text-slate-500 mb-4">{error}</p>
                <button
                    onClick={fetchStudents}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Enrolled Students</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{students.length} student{students.length !== 1 ? 's' : ''} across all your courses</p>
                </div>
                <button
                    onClick={fetchStudents}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200">
                {students.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-slate-700 mb-1">No students enrolled yet</h3>
                        <p className="text-xs text-slate-400">Students will appear here once they enroll in your courses</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">#</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Student</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Course</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Enrolled On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.map((enroll, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3 text-xs text-slate-400 w-10">{idx + 1}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={enroll.student?.imageUrl}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                    onError={(e) => {
                                                        // Replace broken image with initial-letter avatar
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div
                                                    className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center text-xs font-semibold text-slate-500 flex-shrink-0"
                                                    style={{ display: 'none' }}
                                                >
                                                    {enroll.student?.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="text-sm text-slate-700 font-medium truncate">
                                                    {enroll.student?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{enroll.courseTitle}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {enroll.purchaseDate
                                                    ? new Date(enroll.purchaseDate).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })
                                                    : '—'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentEnrolled
