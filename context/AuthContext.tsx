// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
// Import các interface nếu bạn đã tách file, hoặc định nghĩa tạm ở đây
import { LoginRequestDTO, RegisterRequestDTO } from '../type/authInterfaces.type';

// Định nghĩa kiểu User cho Context
export interface User {
  username: string;
  email: string;
  role: string;
  fullName?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Khôi phục phiên đăng nhập khi F5 trang
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('jwtToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Khôi phục user từ localStorage
          setUser(JSON.parse(storedUser));

          // (Tùy chọn) Gọi API getProfile để lấy thông tin mới nhất và check token còn sống không
          // await authApi.getProfile(); 
        } catch (error) {
          console.error("Session expired or invalid:", error);
          logout(); // Token lỗi thì logout luôn
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 2. Hàm Đăng Nhập (Gọi API Backend)
  const login = async (identifier: string, pass: string): Promise<void> => {
    try {
      // Gọi API Login
      const response: any = await authApi.login({ identifier, password: pass });

      // Cấu trúc: { success: true, data: { access_token: "...", ... } }
      const data = response?.data || response;
      const token = data?.accessToken || data?.token || data?.access_token || response?.accessToken || response?.token || response?.access_token;

      if (token) {
        // Lưu Token quan trọng nhất
        localStorage.setItem('jwtToken', token);

        // Tạo object User để lưu state
        const userData: User = {
          username: data?.username || response?.username || "",
          email: data?.email || response?.email || "",
          role: data?.role || response?.role || "USER",
          fullName: data?.fullName || response?.fullName || ""
        };

        // Lưu thông tin user để F5 không mất
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error("Không nhận được token từ máy chủ");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Ném lỗi ra để LoginPage hiển thị
    }
  };

  // 3. Hàm Đăng Ký (Gọi API Backend)
  const register = async (registerData: any): Promise<void> => {
    try {
      // Gọi API Register (Backend tự gán role USER)
      // Dữ liệu gồm: username, email, phone, password, fullName
      await authApi.register(registerData);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // 4. Hàm Đăng Xuất
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    // Xóa các dữ liệu tạm khác nếu có
    localStorage.removeItem('myEventBookings');

    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook custom để dùng context dễ dàng hơn
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};