import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaPhone, FaEnvelope, FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import bookingApi from '../api/bookingApi';
import zaloLogo from '../assets/zalo.webp';
import { ContactData, Props } from '@/type/contact.type';
import { toast } from 'react-toastify';

const ContactInfoModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);

    // State lưu kênh: 'email' hoặc 'zalo'
    const [otpMethod, setOtpMethod] = useState<'EMAIL' | 'ZALO'>('EMAIL');

    // Khởi tạo formData
    const [formData, setFormData] = useState<ContactData>({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        otp: '',
        channel: 'EMAIL'
    });

    // --- SỬA 1: Dùng callback để đảm bảo state luôn mới nhất ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // --- SỬA 2: Hàm chuyển đổi kênh nhận vé (Đồng bộ cả otpMethod và formData) ---
    const handleMethodChange = (method: 'EMAIL' | 'ZALO') => {
        setOtpMethod(method);
        setFormData(prev => ({
            ...prev,
            channel: method // Cập nhật luôn channel trong formData
        }));
    };

    const validatePhone = (phone: string) => {
        const regex = /^(03|05|07|08|09)[0-9]{8}$/;
        return regex.test(phone);
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.customerName || !formData.customerPhone) {
            toast.error("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
            return;
        }
        if (!validatePhone(formData.customerPhone)) {
            toast.error("Số điện thoại không hợp lệ (10 số, đầu 03/05/07/08/09)");
            return;
        }
        if (otpMethod === 'EMAIL' && !formData.customerEmail) {
            toast.error("Vui lòng nhập Email!");
            return;
        }

        setLoading(true);
        try {
            const destination = otpMethod === 'EMAIL' ? formData.customerEmail : formData.customerPhone;
            await bookingApi.requestOtp(destination, otpMethod, 'SHOW');
            toast.success(`Mã OTP đã gửi tới ${otpMethod === 'EMAIL' ? 'Email' : 'Zalo'}!`);
            setStep(2);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Gửi OTP thất bại.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // --- SỬA 3: Chuẩn hóa dữ liệu lần cuối trước khi gửi ---
    const handleSubmitConfirm = () => {
        if (!formData.otp || formData.otp.length < 6) {
            toast.error("Vui lòng nhập đủ 6 số OTP");
            return;
        }

        // Tạo object dữ liệu cuối cùng sạch sẽ
        const finalData = {
            ...formData,
            // Ép đúng channel hiện tại đang chọn
            channel: otpMethod,
            // Nếu là Zalo thì email gửi là null (để backend không validate lỗi format email rỗng)
            customerEmail: (otpMethod === 'ZALO') ? null : formData.customerEmail,
            // Đảm bảo lấy OTP mới nhất từ state
            otp: formData.otp 
        };
        
        // Log kiểm tra trước khi bắn sang BookingModal
        console.log("🚀 Submit Data:", finalData);

        onConfirm(finalData as any);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        {step === 2 && (
                            <button type="button" onClick={() => setStep(1)} className="hover:bg-white/20 p-1 rounded-full transition"><FaArrowLeft /></button>
                        )}
                        <h3 className="text-lg font-bold">{step === 1 ? "Thông Tin Nhận Vé" : "Xác Thực OTP"}</h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition"><FaTimes size={20} /></button>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nhận mã OTP và vé qua:</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        // SỬA: Gọi hàm handleMethodChange
                                        onClick={() => handleMethodChange('EMAIL')}
                                        className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all font-medium ${otpMethod === 'EMAIL' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        <FaEnvelope size={18} /> Email
                                    </button>
                                    <button
                                        type="button"
                                        // SỬA: Gọi hàm handleMethodChange
                                        onClick={() => handleMethodChange('ZALO')}
                                        className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all font-medium ${otpMethod === 'ZALO' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        <img src={zaloLogo} alt="Zalo" className="w-6 h-6 object-contain" /> Zalo
                                    </button>
                                </div>
                            </div>

                            {/* Các input giữ nguyên, chỉ đảm bảo name khớp với state */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400"><FaUser /></span>
                                    <input name="customerName" value={formData.customerName} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nguyễn Văn A" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400"><FaPhone /></span>
                                    <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0912xxxxxx" required />
                                </div>
                            </div>

                            {otpMethod === 'EMAIL' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-400"><FaEnvelope /></span>
                                        <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="email@example.com" required />
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all mt-4 flex justify-center items-center gap-2 disabled:bg-gray-400">
                                {loading ? <> <span className="animate-spin"><FaSpinner /></span>Đang gửi OTP...</> : "Tiếp tục & Gửi OTP"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
                                    {otpMethod === 'EMAIL' ? <span className="text-blue-600 text-2xl"><FaEnvelope /></span> : <span className="text-blue-600 text-2xl"><img src={zaloLogo} alt="Zalo" className="w-8 h-8 object-contain" /></span>}
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">Kiểm tra {otpMethod === 'EMAIL' ? 'email' : 'zalo'} của bạn</h4>
                                <p className="text-sm text-gray-500 mt-1">Mã OTP đã được gửi đến <br /><span className="font-bold text-indigo-600 text-lg">{otpMethod === 'EMAIL' ? formData.customerEmail : formData.customerPhone}</span></p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Nhập mã xác thực (6 số)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-orange-500"><FaLock /></span>
                                    <input 
                                        name="otp" 
                                        value={formData.otp} 
                                        onChange={handleChange} 
                                        maxLength={6} 
                                        className="w-full pl-10 pr-3 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none text-center text-2xl font-bold tracking-[0.5em] text-gray-700" 
                                        placeholder="000000" 
                                        autoFocus 
                                    />
                                </div>
                            </div>

                            <button onClick={handleSubmitConfirm} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-transform active:scale-95">Xác nhận & Thanh toán</button>
                            
                            <div className="text-center text-xs text-gray-500 mt-2">
                                Chưa nhận được mã? <button type="button" onClick={(e) => handleSendOtp(e as any)} disabled={loading} className="text-blue-600 hover:underline font-medium disabled:text-gray-400">{loading ? 'Đang gửi...' : 'Gửi lại mã'}</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactInfoModal;