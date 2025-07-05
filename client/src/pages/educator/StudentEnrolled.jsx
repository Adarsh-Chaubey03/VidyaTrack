import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

function StudentEnrolled() {
    const { educatorEnrolledStudents } = useContext(AppContext);
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Students Enrolled</h1>
            <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-left">Student</th>
                            <th className="px-4 py-2 border-b text-left">Course</th>
                            <th className="px-4 py-2 border-b text-left">Enrolled On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {educatorEnrolledStudents.map((enroll, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-2 border-b flex items-center gap-2">
                                    <img src={enroll.student.imageUrl || assets.profile_img} alt={enroll.student.name} className="w-8 h-8 rounded-full" />
                                    <span className="truncate">{enroll.student.name}</span>
                                </td>
                                <td className="px-4 py-2 border-b">{enroll.courseTitle}</td>
                                <td className="px-4 py-2 border-b">{new Date(enroll.purchaseDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentEnrolled
