// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Cần cài react-icons nếu chưa có

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Bắt đầu loading

    try {
      // Hàm login này sẽ gọi API /auth/login của Backend
      await login(email, password);
      
      // Đăng nhập thành công -> Về trang chủ
      navigate('/'); 
    } catch (err: any) {
      console.error("Login failed:", err);
      // Lấy thông báo lỗi từ Backend trả về (nếu có)
      const msg = err.response?.data?.message || err.response?.data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700">
                Mơ Màng <span className="text-orange-500">Show</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Đăng nhập để đặt vé và xem lịch sử</p>
        </div>

        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm rounded">
                <p className="font-bold">Lỗi!</p>
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="nhapemail@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Mật khẩu
            </label>
            <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600"
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
              ) : "Đăng Nhập"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center border-t pt-4">
            <p className="text-gray-600 text-sm">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline">
                    Đăng ký ngay
                </Link>
            </p>
            <Link to="/" className="text-gray-500 hover:text-gray-800 text-xs mt-3 inline-block">
                ← Quay về trang chủ
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;