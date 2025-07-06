import React from 'react';
import Navbar from '../components/educator/Navbar';
import Sidebar from '../components/educator/Sidebar';
import { Outlet } from 'react-router-dom';

export default function EducatorLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 