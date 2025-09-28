import React from 'react'
import { Outlet } from 'react-router-dom'
import Preview from './Preview'
import { useAuth } from '../../context/AuthContext.jsx'

function Educator() {
    const { user, isAuthenticated, isEducator } = useAuth();

    if (!isAuthenticated() || !isEducator()) {
        // Not logged in or not an educator: show only the Preview page
        return <Preview />;
    }

    // Logged in as educator: show nested educator routes (layout handled by EducatorLayout)
    return <Outlet />;
}

export default Educator
