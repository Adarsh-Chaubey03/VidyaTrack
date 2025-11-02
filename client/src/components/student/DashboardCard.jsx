import React from 'react'
import { Link } from 'react-router-dom'

// Simple reusable card for dashboard sections
const DashboardCard = ({ title, subtitle, children, actionLabel, to }) => {
  return (
    <div className="bg-white rounded-lg shadow p-3 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        <div className="mt-2 text-sm text-gray-700">{children}</div>
      </div>
      {actionLabel && to && (
        <div className="mt-3">
          <Link to={to} className="inline-block bg-emerald-500 text-white px-2 py-1 rounded-md text-sm font-semibold hover:bg-emerald-600">
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  )
}

export default DashboardCard
