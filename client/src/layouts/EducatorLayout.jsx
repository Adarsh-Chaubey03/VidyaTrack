import React from 'react';
import Navbar from '../components/educator/Navbar';
import Sidebar from '../components/educator/Sidebar';
import { Outlet } from 'react-router-dom';

export default function EducatorLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 