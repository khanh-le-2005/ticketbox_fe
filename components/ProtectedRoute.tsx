// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRouteProps } from '@/type/Otpvspay.type';

// Định nghĩa lại Props để hỗ trợ thêm phân quyền (nếu cần sau này)
// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles?: string[]; // Ví dụ: ['ADMIN', 'OPERATOR']
// }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
     return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;