import React, { useState, useEffect } from 'react';
import { ContactInfoModalProps } from '../types';
import { FaTimes, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';

const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPhone('');
            setEmail('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        setError('');
        if (!phone.trim() || !email.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Email không hợp lệ.');
            return;
        }
        onConfirm({ phone, email });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl w-full max-w-md relative animate-fade-in-up">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes size={24} />
                </button>

                <div className="p-8">
                    <h2
                        className="text-2xl font-bold text-yellow-400 mb-6 text-center"
                        style={{ fontFamily: "serif" }}
                    >
                        Thông Tin Liên Hệ
                    </h2>
                    <p className="text-center text-gray-400 mb-6 -mt-4 text-sm">
                        Vui lòng cung cấp thông tin để nhận vé điện tử.
                    </p>

                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="phone" className="text-sm font-bold text-gray-300 flex items-center mb-2">
                                    <FaPhone className="mr-2" /> Số điện thoại
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="09..."
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-bold text-gray-300 flex items-center mb-2">
                                    <FaEnvelope className="mr-2" /> Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

                        <div className="mt-8">
                            <button
                                type="submit"
                                className="w-full font-bold py-3 px-8 rounded-lg text-lg transition-colors flex items-center justify-center space-x-2 bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                                <>
                                    <FaPaperPlane />
                                    <span>Gửi mã OTP</span>
                                </>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoModal;