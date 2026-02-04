import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner, FaSignInAlt } from 'react-icons/fa';

// Ảnh nền bên trái (Giao diện cũ)
const BANNER_IMAGE = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop";

const LoginPage: React.FC = () => {
    // --- GIỮ NGUYÊN LOGIC CỦA BẠN ---
    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth(); // Sử dụng hook useAuth như yêu cầu
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // Gọi hàm login từ useAuth
            await login(identifier, password);
            
            // Chuyển hướng
            navigate('/'); 
        } catch (err: any) {
            console.error("Login failed:", err);
            const msg = err.response?.data?.message || err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setIsLoading(false);
        }
    };
    // --- GIAO DIỆN ĐẸP (OLD UI) ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            {/* Container chính */}
            <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                
                {/* CỘT TRÁI: ẢNH BANNER (Ẩn trên mobile) */}
                <div className="hidden md:flex md:w-5/12 relative bg-gray-900 text-white flex-col justify-between p-8 md:p-12">
                    {/* Ảnh nền mờ */}
                    <div className="absolute inset-0">
                        <img src={BANNER_IMAGE} alt="Concert" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent mix-blend-multiply" />
                    </div>
                    
                    {/* Nội dung trên ảnh */}
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Mơ Màng Show</h2>
                        <p className="text-orange-200 text-sm font-medium">Sống trọn từng khoảnh khắc</p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                            <p className="text-sm font-medium italic text-gray-100">
                                "Chào mừng bạn quay trở lại! Hàng ngàn sự kiện âm nhạc đỉnh cao đang chờ đón bạn."
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
                            <div className="w-2 h-1 bg-gray-500 rounded-full"></div>
                            <div className="w-2 h-1 bg-gray-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
                <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng Nhập</h1>
                        <p className="text-gray-500">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="text-orange-600 font-bold hover:underline">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>

                    {/* Thông báo lỗi */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm animate-pulse flex items-center shadow-sm">
                            <span className="mr-2 font-bold">Oops!</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Input Identifier (Email/Username) */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Tài khoản</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700 placeholder-gray-400"
                                    placeholder="Email hoặc tên đăng nhập"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                                <a href="#" className="text-xs text-orange-600 hover:text-orange-800 font-medium hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700 placeholder-gray-400"
                                    placeholder="Nhập mật khẩu của bạn"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-600 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Button Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin" /> Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        Đăng Nhập <FaSignInAlt />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    
                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;