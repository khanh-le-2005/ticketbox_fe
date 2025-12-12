// src/components/OtpVerificationModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import { OtpVerificationModalProps } from '../types';
import { FaTimes, FaShieldAlt, FaRedo } from 'react-icons/fa';
import axiosClient from '../api/axiosClient'; // Import axios instance

const OTP_LENGTH = 6;

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    contactInfo,
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState('');
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setOtp(new Array(OTP_LENGTH).fill(''));
            setError('');
            setResendSuccess('');
            setIsVerifying(false);
            // Focus vào ô đầu tiên khi mở modal
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- XỬ LÝ NHẬP LIỆU (Giữ nguyên logic tốt của bạn) ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let digit = e.target.value.replace(/\D/g, "");

        const newOtp = [...otp];

        if (digit.length === 0) {
            newOtp[index] = "";
            setOtp(newOtp);
            return;
        }

        if (digit.length === 1) {
            newOtp[index] = digit;
            setOtp(newOtp);
            if (index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            }
            return;
        }

        // Xử lý Paste
        digit = digit.slice(0, OTP_LENGTH - index);
        for (let i = 0; i < digit.length; i++) {
            newOtp[index + i] = digit[i];
        }
        setOtp(newOtp);
        inputRefs.current[Math.min(index + digit.length - 1, OTP_LENGTH - 1)]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // --- GỬI API XÁC THỰC ---
    const handleSubmit = async () => {
        setError('');
        setIsVerifying(true);

        const enteredOtp = otp.join('');
        if (enteredOtp.length !== OTP_LENGTH) {
            setError("Vui lòng nhập đủ 6 số.");
            setIsVerifying(false);
            return;
        }

        try {
            // Gọi API Backend xác thực
            // Bạn cần đảm bảo Backend có API này: POST /api/otp/verify
            await axiosClient.post('/otp/verify', {
                email: contactInfo.email,
                phone: contactInfo.phone,
                otpCode: enteredOtp
            });

            // Nếu không lỗi -> Thành công
            onConfirm(); 
        } catch (err: any) {
            console.error("OTP Error:", err);
            const msg = err.response?.data || "Mã OTP không chính xác hoặc đã hết hạn.";
            setError(typeof msg === 'string' ? msg : "Xác thực thất bại.");
            
            // Clear input để nhập lại
            setOtp(new Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    // --- GỬI LẠI MÃ ---
    const handleResend = async () => {
        setIsResending(true);
        setResendSuccess('');
        setError('');
        try {
            await axiosClient.post('/otp/send', {
                email: contactInfo.email,
                phone: contactInfo.phone
            });
            setResendSuccess('Đã gửi lại mã mới!');
        } catch (err) {
            setError('Không thể gửi lại mã. Vui lòng thử sau.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up overflow-hidden">
                
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-1">Xác thực bảo mật</h2>
                    <p className="text-indigo-100 text-sm">
                        Mã OTP đã được gửi tới <strong>{contactInfo?.email}</strong>
                    </p>
                </div>

                <div className="p-8 text-center">
                    {/* OTP INPUTS */}
                    <div className="flex justify-center gap-2 mb-6">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={otp[index]}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-700 bg-white"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
                    {resendSuccess && <p className="text-green-600 text-sm mb-4 font-medium">{resendSuccess}</p>}

                    <div className="mt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isVerifying || otp.join('').length !== OTP_LENGTH}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifying ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang kiểm tra...</span>
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt />
                                    <span>Xác nhận</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 text-sm text-gray-500 flex justify-center items-center">
                        <span>Chưa nhận được mã?</span>
                        <button 
                            onClick={handleResend}
                            disabled={isResending}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center disabled:opacity-50"
                        >
                            {isResending ? 'Đang gửi...' : <><FaRedo className="mr-1 text-xs"/> Gửi lại</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationModal;