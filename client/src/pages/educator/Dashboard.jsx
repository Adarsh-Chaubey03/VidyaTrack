import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/student/Loading'

function Dashboard() {
    const { currency } = useContext(AppContext)
    const [dashboardData, setDashboardData] = useState(null)
    const fetchDashboardData = async () => {
        setDashboardData(dummyDashboardData);
    };
    useEffect(() => {
        fetchDashboardData()
    }, [])
    return dashboardData ? (
        <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 min-h-screen">
            {/* Stats Row */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mb-6">
                {[
                    { icon: assets.patients_icon, value: dashboardData.enrolledStudentsData.length, label: "Total Enrollments" },
                    { icon: assets.appointments_icon, value: dashboardData.totalCourses, label: "Total Courses" },
                    { icon: assets.earning_icon, value: dashboardData.totalEarnings, label: "Total Earning" }
                ].map((stat, idx) => (
                    <div key={idx} className="flex-1 bg-white rounded-xl shadow-sm flex items-center gap-4 p-4">
                        <div className="bg-blue-100 rounded-lg p-3 flex items-center justify-center">
                            <img src={stat.icon} alt="" className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="text-xl font-bold">{stat.value}</p>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* End Stats Row */}

            {/* Latest Enrollments Table */}
            <div className="w-full mt-4">
                <h2 className="font-semibold mb-2">Latest Enrollments</h2>
                <div className="overflow-x-auto rounded-lg shadow-sm">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b text-left">Student</th>
                                <th className="px-4 py-2 border-b text-left">Course</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.enrolledStudentsData.map((enrollment, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 border-b flex items-center gap-2">
                                        <img src={enrollment.student.imageUrl} alt={enrollment.student.name} className="w-8 h-8 rounded-full" />
                                        <span className="truncate">{enrollment.student.name}</span>
                                    </td>
                                    <td className="px-4 py-2 border-b">{enrollment.courseTitle}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* End Latest Enrollments Table */}
        </div>
    ) : <Loading />
}

export default Dashboard
