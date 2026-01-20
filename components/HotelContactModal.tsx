import React, { useState } from 'react';
import { FaTimes, FaUser, FaPhone, FaEnvelope, FaLock, FaArrowLeft, FaSpinner, FaHotel } from 'react-icons/fa';
import roomApi from "@/api/room_api";
import zaloLogo from '../assets/zalo.webp';
import { ContactData, HotelContactModalProps } from '@/type/contact.type';


const HotelContactModal: React.FC<HotelContactModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);

    // State lưu kênh nhận vé: 'email' hoặc 'zalo'
    const [otpMethod, setOtpMethod] = useState<'email' | 'zalo'>('email');

    const [formData, setFormData] = useState<ContactData>({
        name: '', email: '', phone: '', otp: '', notificationChannel: 'EMAIL'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- XỬ LÝ GỬI OTP (THEO LOGIC MỚI) ---
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validate chung: Tên và SĐT luôn bắt buộc
        if (!formData.name || !formData.phone) {
            alert("Vui lòng điền Họ tên và Số điện thoại!");
            return;
        }

        // 2. Validate riêng theo kênh
        if (otpMethod === 'email' && !formData.email) {
            alert("Bạn chọn nhận vé qua Email, vui lòng nhập địa chỉ Email!");
            return;
        }

        setLoading(true);
        try {
            // 3. Gửi OTP dựa trên kênh đã chọn
            if (otpMethod === 'email') {
                // Kênh Email: Gửi OTP vào Email
                await roomApi.requestOtp(formData.email, 'EMAIL', 'HOTEL');
            } else {
                // Kênh Zalo: Gửi OTP vào SĐT
                await roomApi.requestOtp(formData.phone, 'ZALO', 'HOTEL');
            }
            setStep(2);
        } catch (error: any) {
            console.error("Lỗi gửi OTP:", error);
            const msg = error.response?.data?.message || "Gửi OTP thất bại. Vui lòng kiểm tra lại thông tin.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // const handleSubmitConfirm = () => {
    //     if (!formData.otp || formData.otp.length < 6) {
    //         alert("Vui lòng nhập mã OTP hợp lệ (6 số)");
    //         return;
    //     }

    //     // 4. Trả về dữ liệu kèm notificationChannel chuẩn API
    //     const finalData = {
    //         ...formData,
    //         // Nếu chọn Zalo mà không nhập email thì gửi null (theo tài liệu)
    //         email: (otpMethod === 'zalo' && !formData.email) ? null : formData.email,
    //         notificationChannel: otpMethod === 'email' ? 'EMAIL' : 'ZALO'
    //     };

    //     // Ép kiểu hoặc truyền data đã xử lý về parent
    //     onConfirm(finalData as any);
    // };

    const handleSubmitConfirm = () => {
        if (!formData.otp || formData.otp.length < 6) {
            alert("Vui lòng nhập mã OTP hợp lệ (6 số)");
            return;
        }

        // 🔥 FIX QUAN TRỌNG THEO POSTMAN (GIỐNG ContactInfoModal) 🔥
        const finalData = {
            ...formData,

            // 1. Xử lý Email: Nếu chọn Zalo mà không nhập -> Gửi chuỗi rỗng "" (GIỐNG POSTMAN)
            // Tuyệt đối không gửi null hoặc undefined vì Backend @NotBlank sẽ chặn
            email: (otpMethod === 'zalo' && !formData.email) ? "" : formData.email,

            // 2. Thêm key 'channel' & 'notificationChannel' (GIỐNG POSTMAN)
            channel: otpMethod === 'email' ? 'EMAIL' : 'ZALO',
            notificationChannel: otpMethod === 'email' ? 'EMAIL' : 'ZALO'
        };

        // console.log("🚀 [DEBUG] Dữ liệu gửi lên API (Final Data):", finalData);
        onConfirm(finalData as any);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">

                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        {step === 2 && (
                            <button type="button" onClick={() => setStep(1)} className="hover:bg-white/20 p-1 rounded-full transition"><FaArrowLeft /></button>
                        )}
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <FaHotel /> {step === 1 ? "Thông Tin Khách" : "Xác Thực OTP"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition"><FaTimes size={20} /></button>
                </div>

                <div className="p-6">
                    {/* BƯỚC 1: NHẬP THÔNG TIN */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">

                            {/* Chọn kênh nhận vé */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nhận mã OTP và vé qua:</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtpMethod('email');
                                            setFormData(prev => ({ ...prev, notificationChannel: 'EMAIL' }));
                                        }}
                                        className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all ${otpMethod === 'email' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        <FaEnvelope /> Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtpMethod('zalo');
                                            setFormData(prev => ({ ...prev, notificationChannel: 'ZALO' }));
                                        }}
                                        className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all ${otpMethod === 'zalo' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        <img src={zaloLogo} alt="Zalo" className="w-6 h-6 object-contain" /> Zalo
                                    </button>
                                </div>
                            </div>

                            {/* Input Họ Tên */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên khách hàng <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                                    <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nguyễn Văn A" required />
                                </div>
                            </div>

                            {/* Input SĐT */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại <span className="text-red-500">*</span>
                                    {otpMethod === 'zalo' && <span className="text-xs text-blue-600 ml-1">(Nhận OTP & Vé)</span>}
                                </label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="0912xxxxxx" required />
                                </div>
                            </div>

                            {/* Input Email (Xử lý UI dựa trên otpMethod) */}
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                    {otpMethod === 'email'
                                        ? <span className="text-red-500 ml-1">* (Nhận OTP & Vé)</span>
                                        : <span className="text-gray-400 font-normal ml-1">(Tuỳ chọn)</span>}
                                </label>
                                <div className="relative">
                                    <FaEnvelope className={`absolute left-3 top-3 ${otpMethod === 'email' ? 'text-gray-400' : 'text-gray-300'}`} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none transition-all ${otpMethod === 'email' ? 'focus:ring-2 focus:ring-orange-500 border-gray-300' : 'focus:ring-1 focus:ring-gray-300 border-gray-200 bg-gray-50'}`}
                                        placeholder={otpMethod === 'email' ? "email@example.com" : "Nhập email (nếu có)"}
                                        required={otpMethod === 'email'} // Chỉ bắt buộc khi chọn Email
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg mt-4 flex justify-center items-center gap-2 disabled:bg-gray-400">
                                {loading ? <><FaSpinner className="animate-spin" /> Đang gửi...</> : "Gửi OTP Xác thực"}
                            </button>
                        </form>
                    )}

                    {/* BƯỚC 2: NHẬP OTP */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-100">
                                    {otpMethod === 'email' ? (
                                        <FaEnvelope className="text-orange-600 text-2xl" />
                                    ) : (
                                        <img src={zaloLogo} alt="Zalo" className="w-8 h-8 object-contain" />
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">
                                    {otpMethod === 'email' ? 'Kiểm tra Email của bạn' : 'Kiểm tra Zalo của bạn'}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Mã OTP đã được gửi đến <br />
                                    <span className="font-bold text-orange-600 text-lg">
                                        {otpMethod === 'email' ? formData.email : formData.phone}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Nhập mã xác thực (6 số)</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3.5 text-orange-500" />
                                    <input name="otp" value={formData.otp} onChange={handleChange} maxLength={6} className="w-full pl-10 pr-3 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none text-center text-2xl font-bold tracking-[0.5em] text-gray-700" placeholder="000000" autoFocus />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={handleSubmitConfirm} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-transform active:scale-95">Hoàn tất đặt phòng</button>
                            </div>

                            <div className="text-center text-xs text-gray-500">
                                Chưa nhận được mã? <button type="button" onClick={(e) => handleSendOtp(e as any)} disabled={loading} className="text-orange-600 hover:underline font-medium disabled:text-gray-400">{loading ? 'Đang gửi...' : 'Gửi lại mã'}</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default HotelContactModal;