
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Ticket<span className="text-orange-500">Go</span> Dashboard</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-semibold text-gray-900">Protected Area</h1>
            <p className="mt-2 text-gray-600">
              This is a protected dashboard page. You can only see this content because you are logged in.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
