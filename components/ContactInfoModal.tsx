// src/components/ContactInfoModal.tsx

import React, { useState, useEffect } from 'react';
import { ContactInfoModalProps } from '../types';
import { FaTimes, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import axiosClient from '../api/axiosClient'; // Import axios instance
import { useAuth } from '../hooks/useAuth'; // Lấy thông tin user đã login

const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const { user } = useAuth(); // Lấy user từ context
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Tự động điền email nếu người dùng đã đăng nhập
            if (user?.email) setEmail(user.email);
            else setEmail('');
            
            setPhone('');
            setError('');
            setIsLoading(false);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setError('');
        
        // 1. Validate
        if (!phone.trim() || !email.trim()) {
            setError('Vui lòng nhập đầy đủ email và số điện thoại.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Địa chỉ Email không hợp lệ.');
            return;
        }
        if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone)) {
            // Regex đơn giản cho sđt Việt Nam (hoặc bỏ qua nếu muốn lỏng lẻo hơn)
           // setError('Số điện thoại không đúng định dạng.'); 
           // return;
        }

        // 2. Gọi API Gửi OTP
        setIsLoading(true);
        try {
            // Gọi API Backend: POST /api/otp/send
            await axiosClient.post('/otp/send', { email, phone });
            
            // Nếu thành công, chuyển sang bước nhập OTP
            onConfirm({ phone, email });
        } catch (err: any) {
            console.error("Gửi OTP lỗi:", err);
            const msg = err.response?.data || "Không thể gửi OTP. Vui lòng thử lại.";
            setError(typeof msg === 'string' ? msg : "Lỗi kết nối server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up overflow-hidden">
                
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-1">Thông Tin Liên Hệ</h2>
                    <p className="text-indigo-100 text-sm">Chúng tôi sẽ gửi vé điện tử qua email này</p>
                </div>

                <div className="p-8">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <FaEnvelope className="mr-2 text-indigo-500" /> Email nhận vé
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vidu@gmail.com"
                                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                    // Nếu đã login thì có thể disable hoặc để readonly nếu muốn
                                    // readOnly={!!user?.email} 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <FaPhone className="mr-2 text-indigo-500" /> Số điện thoại
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0912..."
                                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                                {error}
                            </div>
                        )}

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang gửi...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="text-sm" />
                                        <span>Gửi mã xác thực (OTP)</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng của chúng tôi.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoModal;