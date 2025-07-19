import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const AuthStatus = () => {
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-xs">
      <h3 className="font-semibold text-gray-800 mb-2">Auth Status</h3>
      <div className="text-sm space-y-1">
        <p><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {userId || 'None'}</p>
        <p><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'None'}</p>
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
      </div>
    </div>
  );
};

export default AuthStatus; 