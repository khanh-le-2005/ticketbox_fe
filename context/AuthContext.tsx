import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const lastLoginTime = localStorage.getItem('lastLoginTime');
        
        if (storedUser && lastLoginTime) {
          const loginTime = parseInt(lastLoginTime, 10);
          const currentTime = Date.now();
          const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
          
          // Token hết hạn sau 24 giờ
          const TOKEN_EXPIRY_HOURS = 24;
          
          if (hoursSinceLogin < TOKEN_EXPIRY_HOURS) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token hết hạn, xóa thông tin đăng nhập
            localStorage.removeItem('user');
            localStorage.removeItem('lastLoginTime');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Lắng nghe thay đổi localStorage từ các tab khác
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'lastLoginTime') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isAdmin = email === 'admin@gmail.com' && pass === '123456';
        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        const isValidUser = accounts.some((acc: any) => acc.email === email && acc.password === pass);

        if (isAdmin || isValidUser) {
          const userData: User = { 
            email,
            // Thêm timestamp để validate session
            lastLogin: Date.now()
          };
          
          // Lưu thông tin đăng nhập với timestamp
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('lastLoginTime', Date.now().toString());
          
          setUser(userData);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const register = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
          
          // Kiểm tra email đã tồn tại chưa
          const emailExists = accounts.some((acc: any) => acc.email === email);
          
          if (emailExists) {
            reject(new Error('Email already registered'));
            return;
          }
          
          accounts.push({ email, password: pass });
          localStorage.setItem('accounts', JSON.stringify(accounts));
          resolve();
        } catch (error) {
          reject(new Error('Registration failed'));
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('lastLoginTime');
    setUser(null);
    
    // Thông báo cho các tab khác về việc logout
    window.dispatchEvent(new Event('storage'));
  };

  // Hàm kiểm tra session còn hiệu lực
  const validateSession = (): boolean => {
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    if (!lastLoginTime) return false;
    
    const loginTime = parseInt(lastLoginTime, 10);
    const currentTime = Date.now();
    const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
    
    return hoursSinceLogin < 24; // 24 giờ
  };

  const value = { 
    user, 
    login, 
    register, 
    logout, 
    loading,
    validateSession // Export thêm hàm validate nếu cần
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};