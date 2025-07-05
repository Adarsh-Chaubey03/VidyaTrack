import React from 'react';
import Navbar from '../components/student/Navbar';
import { Outlet } from 'react-router-dom';

export default function StudentLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
} 