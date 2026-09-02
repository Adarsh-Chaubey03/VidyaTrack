import React, { useEffect, useState } from 'react'
import { apiService } from '../../services/api'
import { Users, AlertCircle, RefreshCw, Calendar, GraduationCap, BookOpen } from 'lucide-react'
import { SkeletonStudentEnrolled } from '../../components/skeleton/Skeleton'

function StudentEnrolled() {
    const [activeTab, setActiveTab] = useState('enrolled')

    // ── Enrolled students state ─────────────────────────────────────────
    const [students, setStudents]       = useState([])
    const [loadingS, setLoadingS]       = useState(true)
    const [errorS, setErrorS]           = useState(null)

    // ── Mentees state ───────────────────────────────────────────────────
    const [mentees, setMentees]         = useState([])
    const [loadingM, setLoadingM]       = useState(true)
    const [errorM, setErrorM]           = useState(null)

    const fetchStudents = async () => {
        setLoadingS(true)
        setErrorS(null)
        try {
            const result = await apiService.educator.getStudents()
            if (result.success) {
                setStudents(result.enrolledStudents || [])
            } else {
                setErrorS(result.message || 'Failed to load students')
            }
        } catch {
            setErrorS('Unable to connect to server')
        } finally {
            setLoadingS(false)
        }
    }

    const fetchMentees = async () => {
        setLoadingM(true)
        setErrorM(null)
        try {
            const result = await apiService.educator.getMentees()
            if (result.success) {
                setMentees(result.mentees || [])
            } else {
                setErrorM(result.message || 'Failed to load mentees')
            }
        } catch {
            setErrorM('Unable to connect to server')
        } finally {
            setLoadingM(false)
        }
    }

    useEffect(() => {
        fetchStudents()
        fetchMentees()
    }, [])

    // ── Shared error block ──────────────────────────────────────────────
    const ErrorBlock = ({ msg, onRetry }) => (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Failed to load</h3>
            <p className="text-sm text-slate-500 mb-4">{msg}</p>
            <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
                <RefreshCw className="w-4 h-4" /> Retry
            </button>
        </div>
    )

    // ── Avatar helper ───────────────────────────────────────────────────
    const Avatar = ({ src, name }) => (
        <div className="relative flex-shrink-0">
            <img
                src={src}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center text-xs font-semibold text-slate-500"
                style={{ display: 'none' }}
            >
                {name?.charAt(0)?.toUpperCase() || '?'}
            </div>
        </div>
    )

    const tabs = [
        { key: 'enrolled', label: 'Enrolled Students', count: students.length, Icon: BookOpen },
        { key: 'mentees',  label: 'Active Mentees',    count: mentees.length,  Icon: GraduationCap },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Students</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Course enrollments and mentorship students</p>
                </div>
                <button
                    onClick={() => { fetchStudents(); fetchMentees(); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === tab.key
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <tab.Icon className="w-4 h-4" />
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                activeTab === tab.key
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-200 text-slate-600'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── ENROLLED STUDENTS TAB ─────────────────────────────────── */}
            {activeTab === 'enrolled' && (
                <>
                    {loadingS ? (
                        <SkeletonStudentEnrolled />
                    ) : errorS ? (
                        <ErrorBlock msg={errorS} onRetry={fetchStudents} />
                    ) : (
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
                                                            <Avatar src={enroll.student?.imageUrl} name={enroll.student?.name} />
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
                    )}
                </>
            )}

            {/* ── ACTIVE MENTEES TAB ────────────────────────────────────── */}
            {activeTab === 'mentees' && (
                <>
                    {loadingM ? (
                        <SkeletonStudentEnrolled />
                    ) : errorM ? (
                        <ErrorBlock msg={errorM} onRetry={fetchMentees} />
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200">
                            {mentees.length === 0 ? (
                                <div className="px-6 py-16 text-center">
                                    <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">No active mentees yet</h3>
                                    <p className="text-xs text-slate-400">Students whose requests you accept will appear here</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">#</th>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Student</th>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Introduction</th>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Accepted On</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {mentees.map((mentee, idx) => (
                                                <tr key={mentee.requestId} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-5 py-3 text-xs text-slate-400 w-10">{idx + 1}</td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar src={mentee.student?.imageUrl} name={mentee.student?.name} />
                                                            <div className="min-w-0">
                                                                <p className="text-sm text-slate-700 font-medium truncate">
                                                                    {mentee.student?.name || 'Unknown'}
                                                                </p>
                                                                {mentee.student?.email && (
                                                                    <p className="text-xs text-slate-400 truncate">{mentee.student.email}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <p className="text-sm text-slate-500 max-w-xs truncate italic">
                                                            &ldquo;{mentee.introduction}&rdquo;
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {mentee.acceptedOn
                                                                ? new Date(mentee.acceptedOn).toLocaleDateString('en-US', {
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
                    )}
                </>
            )}
        </div>
    )
}

export default StudentEnrolled
