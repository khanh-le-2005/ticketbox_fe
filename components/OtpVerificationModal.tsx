import React, { useState, useRef, useEffect } from 'react';
import { OtpVerificationModalProps } from '../types';
import { FaTimes, FaShieldAlt } from 'react-icons/fa';

const OTP_LENGTH = 6;
const CORRECT_OTP = '123456'; // Mock OTP

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    contactInfo,
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setOtp(new Array(OTP_LENGTH).fill(''));
            setError('');
            setIsVerifying(false);
            inputRefs.current[0]?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- FIX LỖI LẶP: HÀM CHANGE AN TOÀN ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let digit = e.target.value.replace(/\D/g, ""); // Chỉ nhận số

        const newOtp = [...otp];

        // Nếu xoá ký tự
        if (digit.length === 0) {
            newOtp[index] = "";
            setOtp(newOtp);
            return;
        }

        // Nếu có 1 ký tự → ghi vào ô hiện tại
        if (digit.length === 1) {
            newOtp[index] = digit;
            setOtp(newOtp);

            // Tự chuyển qua ô tiếp theo
            if (index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            }
            return;
        }

        // Nếu dán chuỗi dài hơn
        digit = digit.slice(0, OTP_LENGTH - index);
        for (let i = 0; i < digit.length; i++) {
            newOtp[index + i] = digit[i];
        }

        setOtp(newOtp);

        // Focus ô cuối cùng hợp lệ
        inputRefs.current[Math.min(index + digit.length - 1, OTP_LENGTH - 1)]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        setError('');
        setIsVerifying(true);

        const enteredOtp = otp.join('');

        setTimeout(() => {
            if (enteredOtp === CORRECT_OTP) {
                onConfirm();
            } else {
                setError('Mã OTP không chính xác. Vui lòng thử lại.');
                setOtp(new Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
            }
            setIsVerifying(false);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl w-full max-w-md relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <FaTimes size={24} />
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4" style={{ fontFamily: "serif" }}>
                        Xác thực OTP
                    </h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        Một mã OTP gồm {OTP_LENGTH} chữ số đã được gửi tới{' '}
                        <span className="font-bold text-white">{contactInfo?.phone || contactInfo?.email}</span>.
                        <br/>(Mã OTP mẫu: {CORRECT_OTP})
                    </p>

                    {/* OTP INPUTS */}
                    <div className="flex justify-center space-x-1 sm:space-x-2 mb-4">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={otp[index]}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                    <div className="mt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={isVerifying || otp.join('').length !== OTP_LENGTH}
                            className="w-full font-bold py-3 px-8 rounded-lg text-lg transition-colors flex items-center justify-center space-x-2 bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            {isVerifying ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang xác thực...</span>
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt />
                                    <span>Xác thực</span>
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        Chưa nhận được mã? <button className="text-yellow-500 hover:underline">Gửi lại</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationModal;