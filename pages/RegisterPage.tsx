import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, 
    FaSpinner, FaIdCard, FaUserPlus 
} from 'react-icons/fa';

// Ảnh nền giống trang Login để đồng bộ
const BANNER_IMAGE = "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form dữ liệu
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // State quản lý hiển thị mật khẩu (UI Only)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm validate số điện thoại VN
    const validatePhone = (phone: string) => {
        const regex = /^(03|05|07|08|09)[0-9]{8}$/;
        return regex.test(phone);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validate Mật khẩu
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        // 2. Validate Số điện thoại
        if (!validatePhone(formData.phone)) {
            alert("Số điện thoại không hợp lệ! Vui lòng nhập 10 số và bắt đầu bằng 03, 05, 07, 08, 09.");
            return;
        }

        setLoading(true);

        try {
            // Cấu trúc JSON gửi lên
            const payload = {
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                fullName: formData.fullName
            };

            console.log("Dữ liệu gửi đi:", payload);

            // Gọi API
            const response = await fetch('https://api.momangshow.vn/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // Kiểm tra phản hồi
            if (response.ok && data.success) {
                alert(data.message || "Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
                navigate('/login');
            } else {
                const errorMessage = data.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
                throw new Error(errorMessage);
            }

        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            alert(error.message || "Có lỗi kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER GIAO DIỆN MỚI ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            {/* Main Card Container */}
            <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
                
                {/* CỘT TRÁI: BANNER (Giống Login) */}
                <div className="hidden md:flex md:w-5/12 relative bg-gray-900 text-white flex-col justify-between p-12">
                    <div className="absolute inset-0">
                        <img src={BANNER_IMAGE} alt="Register Banner" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent mix-blend-multiply" />
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Mơ Màng Show</h2>
                        <p className="text-orange-200 text-sm font-medium">Kết nối đam mê âm nhạc</p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                            <p className="text-sm font-medium italic text-gray-100">
                                "Tạo tài khoản ngay để đặt vé sớm nhất và nhận nhiều ưu đãi hấp dẫn."
                            </p>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM ĐĂNG KÝ */}
                <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-white relative overflow-y-auto">
                    
                    <div className="mb-6 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng Ký</h1>
                        <p className="text-gray-500">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-orange-600 font-bold hover:underline">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Họ và tên</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        name="fullName"
                                        type="text"
                                        required
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Tên đăng nhập</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaIdCard className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                        placeholder="username123"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                    placeholder="example@gmail.com"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Số điện thoại</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    name="phone"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                    placeholder="09xx..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-600 focus:outline-none"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Xác nhận mật khẩu</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-600 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" /> Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        Đăng Ký <FaUserPlus />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;