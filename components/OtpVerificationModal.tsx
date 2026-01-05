import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaRedo } from 'react-icons/fa';
import { ContactInfo } from '../types';
import VerificationApi from '../api/verification_api';

interface OtpVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (otpCode: string) => void;
    contactInfo: ContactInfo;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    contactInfo 
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    
    // 🔥 CẬP NHẬT 1: Đặt thời gian 5 phút (300 giây)
    const [timer, setTimer] = useState(300); 
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Đếm ngược
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // 🔥 CẬP NHẬT 2: Hàm format giây thành phút:giây (VD: 04:59)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join("");
        if (otpCode.length < 6) {
            alert("Vui lòng nhập đủ 6 số OTP");
            return;
        }

        try {
            setIsLoading(true);
            const res = await VerificationApi.verifyOtp({
                email: contactInfo.email,
                otpCode: otpCode
            });

            if (res && res.success) {
                onConfirm(otpCode);
            } else {
                alert("❌ Mã OTP không chính xác hoặc đã hết hạn!");
                setOtp(new Array(6).fill(""));
                inputRefs.current[0]?.focus();
            }
        } catch (error: any) {
            console.error("Lỗi xác thực:", error);
            const msg = error.response?.data?.message || "Lỗi kết nối Server";
            alert(`❌ ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔥 CẬP NHẬT 3: Hàm gửi lại OTP
    const handleResend = async () => {
        try {
            setIsLoading(true);
            console.log("Đang gửi lại OTP...");
            
            const res = await VerificationApi.requestOtp(contactInfo.email);
            
            if (res && res.success) {
                alert("✅ Đã gửi lại mã OTP mới vào email!");
                setTimer(300); // Reset lại 5 phút
                setOtp(new Array(6).fill("")); // Xóa ô nhập cũ
                inputRefs.current[0]?.focus();
            } else {
                alert("Gửi lại thất bại: " + res.message);
            }
        } catch (error) {
            alert("Không thể gửi lại mã. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all">
                
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Xác Thực OTP</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-8 text-center">
                    <p className="text-gray-600 mb-2">Mã xác thực đã được gửi đến email:</p>
                    <p className="font-bold text-indigo-700 text-lg mb-6">{contactInfo.email}</p>

                    <div className="flex justify-center gap-2 mb-6">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    <div className="text-sm text-gray-500 mb-8 h-6">
                        {timer > 0 ? (
                            <p>Mã hết hạn sau: <span className="font-bold text-orange-500 text-base">{formatTime(timer)}</span></p>
                        ) : (
                            <p className="text-red-500 font-medium">Mã đã hết hạn</p>
                        )}
                    </div>

                    {/* 🔥 CẬP NHẬT 4: Nút Gửi lại luôn hiển thị (nhưng disable khi đang đếm ngược nếu muốn chặt chẽ) */}
                    {/* Ở đây mình để logic: Nếu hết giờ (timer=0) MỚI cho ấn. Nếu bạn muốn ấn lúc nào cũng được thì bỏ đoạn `disabled={timer > 0}` đi */}
                    
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleVerify}
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all
                                ${isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'}
                            `}
                        >
                            {isLoading ? "Đang xử lý..." : "XÁC NHẬN"}
                        </button>

                        <button 
                            onClick={handleResend}
                            // Nếu muốn cho phép ấn bất cứ lúc nào -> Xóa dòng disabled={timer > 0} bên dưới đi
                            disabled={isLoading || timer > 0} 
                            className={`flex items-center justify-center gap-2 font-semibold transition-colors
                                ${timer > 0 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-indigo-600 hover:text-indigo-800 cursor-pointer'}
                            `}
                        >
                            <FaRedo size={14} /> Gửi lại mã OTP
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OtpVerificationModal;