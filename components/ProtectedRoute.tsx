// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Định nghĩa lại Props để hỗ trợ thêm phân quyền (nếu cần sau này)
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Ví dụ: ['ADMIN', 'OPERATOR']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Giao diện Loading đẹp (Đồng bộ với các trang khác)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  // 2. Chưa đăng nhập -> Đá về Login
  if (!user) {
    // state={{ from: location }} giúp login xong tự quay lại trang này
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. (Tùy chọn) Kiểm tra Quyền (Role)
  // Nếu route này yêu cầu quyền cụ thể (VD: Admin) mà user không có -> Đá về trang chủ
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
     return <Navigate to="/" replace />; // Hoặc trang 403 Forbidden
  }

  // 4. Hợp lệ -> Cho vào
  return <>{children}</>;
};

export default ProtectedRoute;