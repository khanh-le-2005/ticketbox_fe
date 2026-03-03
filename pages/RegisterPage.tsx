import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, 
    FaSpinner, FaIdCard, FaUserPlus 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const BANNER_IMAGE = "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePhone = (phone: string) => {
        const regex = /^(03|05|07|08|09)[0-9]{8}$/;
        return regex.test(phone);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (!validatePhone(formData.phone)) {
            toast.error("Số điện thoại không hợp lệ! Vui lòng nhập 10 số và bắt đầu bằng 03, 05, 07, 08, 09.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                fullName: formData.fullName
            };
            const response = await fetch('https://api.momangshow.vn/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                toast.success(data.message || "Đăng ký thành công!");
                navigate('/login');
            } else {
                toast.error(data.message || "Đăng ký thất bại.");
            }
        } catch (error: any) {
            toast.error(error.message || "Lỗi kết nối.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans leading-relaxed">
            {/* Thu nhỏ max-width từ 6xl xuống 4xl để form trông cao và gọn hơn */}
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                
                {/* CỘT TRÁI: Thu hẹp độ rộng banner */}
                <div className="hidden md:flex md:w-2/5 relative bg-gray-900 text-white flex-col justify-between p-8">
                    <div className="absolute inset-0">
                        <img src={BANNER_IMAGE} alt="Register Banner" className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 to-black/80" />
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black tracking-tight mb-1">Mơ Màng Show</h2>
                        <p className="text-orange-300 text-xs font-bold uppercase tracking-widest">Connect with Music</p>
                    </div>

                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-2xl">
                            <p className="text-xs font-medium italic leading-relaxed text-gray-200">
                                "Tham gia cộng đồng Mơ Màng để không bỏ lỡ những đêm nhạc tuyệt vời nhất."
                            </p>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: Tối ưu không gian Form */}
                <div className="w-full md:w-3/5 p-8 md:px-12 py-10 flex flex-col justify-center bg-white">
                    
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-2xl font-black text-gray-800 mb-1">Tạo tài khoản</h1>
                        <p className="text-gray-400 text-sm font-medium">
                            Chào mừng bạn đến với Mơ Màng Show
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-3">
                            {/* Full Name & Username đi cùng 1 hàng nhưng bo gọn */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Họ tên</label>
                                    <div className="relative group">
                                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors text-xs" />
                                        <input name="fullName" type="text" required onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm shadow-sm" placeholder="Nguyễn Văn A" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                                    <div className="relative group">
                                        <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors text-xs" />
                                        <input name="username" type="text" required onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm shadow-sm" placeholder="username123" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors text-xs" />
                                    <input name="email" type="email" required onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm shadow-sm" placeholder="example@gmail.com" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Điện thoại</label>
                                <div className="relative group">
                                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors text-xs" />
                                    <input name="phone" type="text" required onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm shadow-sm" placeholder="09xxxxxxxx" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                                    <div className="relative group">
                                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors text-xs" />
                                        <input name="password" type={showPassword ? "text" : "password"} required onChange={handleChange} className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm shadow-sm" placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 outline-none">
                                            {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Xác nhận</label>
                                    <div className="relative group">
                                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors text-xs" />
                                        <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required onChange={handleChange} className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm shadow-sm" placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 outline-none">
                                            {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : <><FaUserPlus size={18} /> ĐĂNG KÝ NGAY</>}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-orange-500 hover:text-orange-600 transition-colors ml-1">
                                Đăng nhập
                            </Link>
                        </p>
                        <div className="pt-4 border-t border-gray-50">
                            <Link to="/" className="text-[11px] font-bold text-gray-300 hover:text-orange-500 uppercase tracking-widest transition-all">
                                ← Quay lại trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;