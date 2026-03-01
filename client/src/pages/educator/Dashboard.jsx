import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { apiService } from '../../services/api'
import { Users, BookOpen, DollarSign, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'
import { SkeletonEducatorDashboard } from '../../components/skeleton/Skeleton'

function Dashboard() {
    const { currency } = useContext(AppContext)
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDashboardData = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await apiService.educator.getDashboard()
            if (result.success) {
                setDashboardData(result.dashboardData)
            } else {
                setError(result.message || 'Failed to load dashboard data')
            }
        } catch (err) {
            setError('Unable to connect to server. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    // Loading skeleton
    if (loading) {
        return <SkeletonEducatorDashboard />
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">Something went wrong</h3>
                <p className="text-sm text-slate-500 mb-4 text-center max-w-sm">{error}</p>
                <button
                    onClick={fetchDashboardData}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </div>
        )
    }

    if (!dashboardData) return null

    const stats = [
        {
            label: 'Total Enrollments',
            value: dashboardData.enrolledStudentsData?.length || 0,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Total Courses',
            value: dashboardData.totalCourses || 0,
            icon: BookOpen,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Total Earnings',
            value: `${currency === 'USD' ? '$' : currency}${(dashboardData.totalEarnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
    ]

    const enrollments = dashboardData.enrolledStudentsData || []

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">Overview of your teaching activity</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
                        >
                            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold text-slate-900 leading-tight">{stat.value}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Latest Enrollments */}
            <div className="bg-white rounded-xl border border-slate-200">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <h2 className="text-sm font-semibold text-slate-800">Latest Enrollments</h2>
                    </div>
                    <span className="text-xs text-slate-400">{enrollments.length} total</span>
                </div>

                {enrollments.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">No enrollments yet</p>
                        <p className="text-xs text-slate-400 mt-1">Students will appear here once they enroll in your courses</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">#</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Student</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Course</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {enrollments.slice(0, 10).map((enrollment, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3 text-xs text-slate-400 w-10">{idx + 1}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={enrollment.student?.imageUrl}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div
                                                    className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center text-xs font-semibold text-slate-500 flex-shrink-0"
                                                    style={{ display: 'none' }}
                                                >
                                                    {enrollment.student?.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="text-sm text-slate-700 font-medium truncate">
                                                    {enrollment.student?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-sm text-slate-600 truncate block max-w-xs">
                                                {enrollment.courseTitle}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {enrollments.length > 10 && (
                            <div className="px-5 py-3 border-t border-slate-100 text-center">
                                <span className="text-xs text-slate-400">Showing 10 of {enrollments.length} enrollments</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
