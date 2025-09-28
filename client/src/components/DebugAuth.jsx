import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const DebugAuth = () => {
  const { user, isAuthenticated, isEducator } = useAuth();

  return (
    <></>
    // <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm z-50">
    //   <h3 className="font-bold mb-2">Auth Debug</h3>
    //   <div>Authenticated: {isAuthenticated() ? 'Yes' : 'No'}</div>
    //   <div>Is Educator: {isEducator() ? 'Yes' : 'No'}</div>
    //   <div>User: {user ? user.name : 'None'}</div>
    //   <div>Role: {user ? user.role : 'None'}</div>
    //   <div>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</div>
    // </div>
  );
};

export default DebugAuth;
