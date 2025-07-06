import React from 'react'
import { Outlet } from 'react-router-dom'
import Preview from './Preview'
import { useUser } from '@clerk/clerk-react'

function Educator() {
    const { user } = useUser();

    if (!user) {
        // Not logged in: show only the Preview page
        return <Preview />;
    }

    // Logged in: show nested educator routes (layout handled by EducatorLayout)
    return <Outlet />;
}

export default Educator
