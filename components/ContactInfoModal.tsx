import React, { useState } from 'react';
import { FaTimes, FaUser, FaPhone, FaEnvelope, FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import bookingApi from '../api/bookingApi'; // Sử dụng API Vé sự kiện
import roomApi from "@/api/room_api"; // Đảm bảo đường dẫn import đúng file roomApi.ts

interface ContactData {
    name: string;
    email: string;
    phone: string;
    otp: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ContactData) => void;
}

const ContactInfoModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    // --- STATE ---
    const [step, setStep] = useState<1 | 2>(1); // 1: Nhập Info, 2: Nhập OTP
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState<ContactData>({
        name: '',
        email: '',
        phone: '',
        otp: ''
    });

    // --- HANDLERS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // BƯỚC 1: Gửi yêu cầu OTP -> Chuyển sang bước 2
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn reload form
        
        // Validate cơ bản
        if (!formData.name || !formData.phone || !formData.email) {
            alert("Vui lòng điền đầy đủ Họ tên, SĐT và Email!");
            return;
        }

        setLoading(true);
        try {
            // Gọi API gửi OTP
            console.log("Đang gửi OTP đến:", formData.email);
            await bookingApi.requestOtp(formData.email);
            
            // Thành công -> Chuyển bước
            setStep(2); 
        } catch (error: any) {
            console.error("Lỗi gửi OTP:", error);
            const msg = error.response?.data?.message || "Gửi OTP thất bại. Vui lòng kiểm tra lại email.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // BƯỚC 2: Submit OTP và Thông tin về Parent để tạo Booking
    const handleSubmitConfirm = () => {
        if (!formData.otp || formData.otp.length < 6) {
            alert("Vui lòng nhập mã OTP hợp lệ (6 số)");
            return;
        }
        // Gọi callback onConfirm truyền dữ liệu ra ngoài cho BookingModal xử lý
        onConfirm(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        {step === 2 && (
                            <button 
                                type="button"
                                onClick={() => setStep(1)} 
                                className="hover:bg-white/20 p-1 rounded-full transition"
                                title="Quay lại"
                            >
                                <FaArrowLeft />
                            </button>
                        )}
                        <h3 className="text-lg font-bold">
                            {step === 1 ? "Xác Thực OTP" : "Xác Thực OTP"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* --- GIAO DIỆN BƯỚC 1: NHẬP THÔNG TIN --- */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="0912xxxxxx"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email nhận vé</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="email"
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    Mã xác thực (OTP) sẽ được gửi đến email này.
                                </p>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg mt-4 flex justify-center items-center gap-2 disabled:bg-gray-400"
                            >
                                {loading ? <><FaSpinner className="animate-spin"/> Đang gửi OTP...</> : "Tiếp tục & Gửi OTP"}
                            </button>
                        </form>
                    )}

                    {/* --- GIAO DIỆN BƯỚC 2: NHẬP OTP --- */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
                                    <FaEnvelope className="text-blue-600 text-2xl" />
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">Kiểm tra email của bạn</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Mã OTP 6 số đã được gửi đến <br/>
                                    <span className="font-bold text-indigo-600">{formData.email}</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Nhập mã xác thực</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3.5 text-orange-500" />
                                    <input 
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        maxLength={6}
                                        className="w-full pl-10 pr-3 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none text-center text-2xl font-bold tracking-[0.5em] text-gray-700 placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
                                        placeholder="000000"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={handleSubmitConfirm}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-transform active:scale-95"
                                >
                                    Xác nhận & Thanh toán
                                </button>
                            </div>
                            
                            <div className="text-center text-xs text-gray-500">
                                Chưa nhận được mã?{' '}
                                <button 
                                    type="button"
                                    onClick={(e) => handleSendOtp(e as any)} 
                                    disabled={loading}
                                    className="text-blue-600 hover:underline font-medium disabled:text-gray-400"
                                >
                                    {loading ? 'Đang gửi...' : 'Gửi lại mã'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactInfoModal;