// import React, { useState } from 'react';
// import { FaTimes, FaUser, FaPhone, FaEnvelope, FaLock, FaArrowLeft, FaSpinner, FaCommentDots } from 'react-icons/fa';
// import bookingApi from '../api/bookingApi'; // Sử dụng API Vé sự kiện
// // import { SiZalo } from 'react-icons/si';
// import zaloLogo from '../assets/zalo.webp';
// import { ContactData, Props } from '@/type/contact.type';
// // import roomApi from "@/api/room_api"; // Đảm bảo đường dẫn import đúng file roomApi.ts

// // interface ContactData {
// //     name: string;
// //     email: string;
// //     phone: string;
// //     otp: string;
// // }

// // interface Props {
// //     isOpen: boolean;
// //     onClose: () => void;
// //     onConfirm: (data: ContactData) => void;
// // }

// const ContactInfoModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
//     // --- STATE ---
//     const [step, setStep] = useState<1 | 2>(1); // 1: Nhập Info, 2: Nhập OTP
//     const [loading, setLoading] = useState(false);
//     const [otpMethod, setOtpMethod] = useState<'email' | 'zalo'>('email');

//     const [formData, setFormData] = useState<ContactData>({
//         name: '',
//         email: '',
//         phone: '',
//         otp: ''
//     });

//     // --- HANDLERS ---
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // BƯỚC 1: Gửi yêu cầu OTP -> Chuyển sang bước 2
//     const handleSendOtp = async (e: React.FormEvent) => {
//         e.preventDefault(); // Ngăn reload form

//         // Validate cơ bản
//         // Validate cơ bản
//         if (!formData.name || !formData.phone || !formData.email) {
//             alert("Vui lòng điền đầy đủ Họ tên, SĐT và Email!");
//             return;
//         }

//         setLoading(true);
//         try {
//             // Gọi API gửi OTP
//             if (otpMethod === 'email') {
//                 await bookingApi.requestOtp(formData.email, 'EMAIL', 'SHOW');
//             } else {
//                 await bookingApi.requestOtp(formData.phone, 'ZALO', 'SHOW');
//             }

//             // Thành công -> Chuyển bước
//             setStep(2);
//         } catch (error: any) {
//             // console.error("Lỗi gửi OTP:", error);
//             const msg = error.response?.data?.message || "Gửi OTP thất bại. Vui lòng kiểm tra lại thông tin.";
//             alert(msg);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // BƯỚC 2: Submit OTP và Thông tin về Parent để tạo Booking
//     const handleSubmitConfirm = () => {
//         if (!formData.otp || formData.otp.length < 6) {
//             alert("Vui lòng nhập mã OTP hợp lệ (6 số)");
//             return;
//         }
//         // Gọi callback onConfirm truyền dữ liệu ra ngoài cho BookingModal xử lý
//         onConfirm(formData);
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">

//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center text-white">
//                     <div className="flex items-center gap-3">
//                         {step === 2 && (
//                             <button
//                                 type="button"
//                                 onClick={() => setStep(1)}
//                                 className="hover:bg-white/20 p-1 rounded-full transition"
//                                 title="Quay lại"
//                             >
//                                 <FaArrowLeft />
//                             </button>
//                         )}
//                         <h3 className="text-lg font-bold">
//                             {step === 1 ? "Xác Thực OTP" : "Xác Thực OTP"}
//                         </h3>
//                     </div>
//                     <button onClick={onClose} className="text-white/80 hover:text-white transition">
//                         <FaTimes size={20} />
//                     </button>
//                 </div>

//                 <div className="p-6">
//                     {/* --- GIAO DIỆN BƯỚC 1: NHẬP THÔNG TIN --- */}
//                     {step === 1 && (
//                         <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
//                                 <div className="relative">
//                                     <FaUser className="absolute left-3 top-3 text-gray-400" />
//                                     <input
//                                         name="name"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                                         placeholder="Nguyễn Văn A"
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại {otpMethod === 'zalo' && "nhận OTP & vé"}</label>
//                                 <div className="relative">
//                                     <FaPhone className="absolute left-3 top-3 text-gray-400" />
//                                     <input
//                                         name="phone"
//                                         value={formData.phone}
//                                         onChange={handleChange}
//                                         className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                                         placeholder="0912xxxxxx"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Nhận mã OTP và nhận vé qua:
//                                 </label>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     {/* Nút Email */}
//                                     <button
//                                         type="button"
//                                         onClick={() => setOtpMethod('email')}
//                                         className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all font-medium ${otpMethod === 'email'
//                                             ? 'border-orange-500 bg-orange-50 text-orange-700'
//                                             : 'border-gray-200 text-gray-500 hover:border-gray-300'
//                                             }`}
//                                     >
//                                         <FaEnvelope size={18} /> Email
//                                     </button>

//                                     {/* Nút Zalo (Đã thay bằng Ảnh) */}
//                                     <button
//                                         type="button"
//                                         onClick={() => setOtpMethod('zalo')}
//                                         className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all font-medium ${otpMethod === 'zalo'
//                                             ? 'border-blue-600 bg-blue-50 text-blue-700'
//                                             : 'border-gray-200 text-gray-500 hover:border-gray-300'
//                                             }`}
//                                     >

//                                         <img
//                                             src={zaloLogo}
//                                             alt="Zalo"
//                                             className="w-6 h-6 object-contain"
//                                         />
//                                         Zalo
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Email (Bắt buộc)</label>
//                                 <div className="relative">
//                                     <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                                         placeholder="email@example.com"
//                                         required
//                                     />
//                                 </div>
//                                 {/* <p className="text-xs text-gray-500 mt-1 italic">
//                                     {otpMethod === 'email' ? 'Vé và mã xác thực sẽ được gửi đến email này.' : 'Mã OTP gửi qua Zalo, vé điện tử gửi qua Email.'}
//                                 </p> */}
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg mt-4 flex justify-center items-center gap-2 disabled:bg-gray-400"
//                             >
//                                 {loading ? <><FaSpinner className="animate-spin" /> Đang gửi OTP...</> : "Tiếp tục & Gửi OTP"}
//                             </button>
//                         </form>
//                     )}

//                     {/* --- GIAO DIỆN BƯỚC 2: NHẬP OTP --- */}
//                     {step === 2 && (
//                         <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
//                             <div className="text-center">
//                                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
//                                     {otpMethod === 'email' ? (
//                                         <FaEnvelope className="text-blue-600 text-2xl" />
//                                     ) : (
//                                         <FaCommentDots className="text-blue-500 text-2xl" />
//                                     )}
//                                 </div>
//                                 <h4 className="font-bold text-gray-800 text-lg">
//                                     {otpMethod === 'email' ? 'Kiểm tra email của bạn' : 'Kiểm tra Zalo của bạn'}
//                                 </h4>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Mã OTP 6 số đã được gửi đến <br />
//                                     <span className="font-bold text-indigo-600">
//                                         {otpMethod === 'email' ? formData.email : formData.phone}
//                                     </span>
//                                 </p>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Nhập mã xác thực</label>
//                                 <div className="relative">
//                                     <FaLock className="absolute left-3 top-3.5 text-orange-500" />
//                                     <input
//                                         name="otp"
//                                         value={formData.otp}
//                                         onChange={handleChange}
//                                         maxLength={6}
//                                         className="w-full pl-10 pr-3 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none text-center text-2xl font-bold tracking-[0.5em] text-gray-700 placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
//                                         placeholder="000000"
//                                         autoFocus
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex gap-3 pt-2">
//                                 <button
//                                     onClick={handleSubmitConfirm}
//                                     className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-transform active:scale-95"
//                                 >
//                                     Xác nhận & Thanh toán
//                                 </button>
//                             </div>

//                             <div className="text-center text-xs text-gray-500">
//                                 Chưa nhận được mã?{' '}
//                                 <button
//                                     type="button"
//                                     onClick={(e) => handleSendOtp(e as any)}
//                                     disabled={loading}
//                                     className="text-blue-600 hover:underline font-medium disabled:text-gray-400"
//                                 >
//                                     {loading ? 'Đang gửi...' : 'Gửi lại mã'}
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactInfoModal;



// import React, { useState } from 'react';
// import { FaTimes, FaUser, FaPhone, FaEnvelope, FaLock, FaArrowLeft, FaSpinner, FaCommentDots } from 'react-icons/fa';
// import bookingApi from '../api/bookingApi';
// import zaloLogo from '../assets/zalo.webp';
// import { ContactData, Props } from '@/type/contact.type';



// const ContactInfoModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
//     const [step, setStep] = useState<1 | 2>(1);
//     const [loading, setLoading] = useState(false);

//     // State lưu kênh: 'email' hoặc 'zalo'
//     const [otpMethod, setOtpMethod] = useState<'email' | 'zalo'>('email');

//     const [formData, setFormData] = useState<ContactData>({
//         name: '',
//         email: '',
//         phone: '',
//         otp: '',
//         notificationChannel: 'EMAIL' // Mặc định là EMAIL
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // --- BƯỚC 1: GỬI OTP ---
//     const handleSendOtp = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!formData.name || !formData.phone) {
//             alert("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
//             return;
//         }

//         // Validate email nếu chọn kênh Email
//         if (otpMethod === 'email' && !formData.email) {
//             alert("Bạn chọn nhận vé qua Email, vui lòng nhập địa chỉ Email!");
//             return;
//         }

//         setLoading(true);
//         try {
//             // Xác định kênh và đích đến OTP
//             const channel = otpMethod === 'email' ? 'EMAIL' : 'ZALO';
//             const destination = otpMethod === 'email' ? formData.email : formData.phone;

//             // Gọi API gửi OTP
//             await bookingApi.requestOtp(destination, channel, 'SHOW');

//             setStep(2);
//         } catch (error: any) {
//             const msg = error.response?.data?.message || "Gửi OTP thất bại. Vui lòng kiểm tra lại thông tin.";
//             alert(msg);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // --- BƯỚC 2: XÁC NHẬN ---
//     const handleSubmitConfirm = () => {
//         if (!formData.otp || formData.otp.length < 6) {
//             alert("Vui lòng nhập mã OTP hợp lệ (6 số)");
//             return;
//         }

//         // 🔥 QUAN TRỌNG: Chuẩn bị dữ liệu cuối cùng có notificationChannel
//         const finalData = {
//             ...formData,
//             // Nếu chọn Zalo mà không nhập email -> Gửi null (để Backend không lỗi validate)
//             email: (otpMethod === 'zalo' && !formData.email) ? null : formData.email,

//             // 👇 THÊM DÒNG NÀY ĐỂ CÓ TRƯỜNG "notificationChannel"
//             notificationChannel: otpMethod === 'email' ? 'EMAIL' : 'ZALO'
//         };

//         // console.log("Data sending from Modal:", finalData); // Bật lên để debug nếu cần
//         onConfirm(finalData as any);
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">

//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center text-white">
//                     <div className="flex items-center gap-3">
//                         {step === 2 && (
//                             <button type="button" onClick={() => setStep(1)} className="hover:bg-white/20 p-1 rounded-full transition"><FaArrowLeft /></button>
//                         )}
//                         <h3 className="text-lg font-bold">
//                             {step === 1 ? "Thông Tin Nhận Vé" : "Xác Thực OTP"}
//                         </h3>
//                     </div>
//                     <button onClick={onClose} className="text-white/80 hover:text-white transition"><FaTimes size={20} /></button>
//                 </div>

//                 <div className="p-6">
//                     {/* STEP 1 */}
//                     {step === 1 && (
//                         <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
//                             <div className="space-y-2">
//                                 <label className="block text-sm font-medium text-gray-700">Nhận mã OTP và nhận vé qua:</label>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <button
//                                         type="button"
//                                         onClick={() => { setOtpMethod('email'); setFormData(p => ({ ...p, notificationChannel: 'EMAIL' })); }}
//                                         className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all font-medium ${otpMethod === 'email' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
//                                     >
//                                         <FaEnvelope size={18} /> Email
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => { setOtpMethod('zalo'); setFormData(p => ({ ...p, notificationChannel: 'ZALO' })); }}
//                                         className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all font-medium ${otpMethod === 'zalo' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
//                                     >
//                                         <img src={zaloLogo} alt="Zalo" className="w-6 h-6 object-contain" /> Zalo
//                                     </button>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
//                                 <div className="relative">
//                                     <FaUser className="absolute left-3 top-3 text-gray-400" />
//                                     <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nguyễn Văn A" required />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
//                                 <div className="relative">
//                                     <FaPhone className="absolute left-3 top-3 text-gray-400" />
//                                     <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0912xxxxxx" required />
//                                 </div>
//                             </div>

//                             <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Email {otpMethod === 'email' ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal">(Tuỳ chọn)</span>}
//                                 </label>
//                                 <div className="relative">
//                                     <FaEnvelope className={`absolute left-3 top-3 ${otpMethod === 'email' ? 'text-gray-400' : 'text-gray-300'}`} />
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         className={`w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none transition-all ${otpMethod === 'email' ? 'focus:ring-2 focus:ring-indigo-500 border-gray-300' : 'focus:ring-1 focus:ring-gray-300 border-gray-200 bg-gray-50'}`}
//                                         placeholder={otpMethod === 'email' ? "email@example.com" : "Nhập email (nếu có)"}
//                                         required={otpMethod === 'email'}
//                                     />
//                                 </div>
//                             </div>

//                             <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg mt-4 flex justify-center items-center gap-2 disabled:bg-gray-400">
//                                 {loading ? <><FaSpinner className="animate-spin" /> Đang gửi OTP...</> : "Tiếp tục & Gửi OTP"}
//                             </button>
//                         </form>
//                     )}

//                     {/* STEP 2 */}
//                     {step === 2 && (
//                         <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
//                             <div className="text-center">
//                                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
//                                     {otpMethod === 'email' ? <FaEnvelope className="text-blue-600 text-2xl" /> : <img src={zaloLogo} alt="Zalo" className="w-8 h-8 object-contain" />}
//                                 </div>
//                                 <h4 className="font-bold text-gray-800 text-lg">Kiểm tra {otpMethod === 'email' ? 'Email' : 'Zalo'} của bạn</h4>
//                                 <p className="text-sm text-gray-500 mt-1">Mã OTP đã được gửi đến <br /><span className="font-bold text-indigo-600 text-lg">{otpMethod === 'email' ? formData.email : formData.phone}</span></p>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Nhập mã xác thực (6 số)</label>
//                                 <div className="relative">
//                                     <FaLock className="absolute left-3 top-3.5 text-orange-500" />
//                                     <input name="otp" value={formData.otp} onChange={handleChange} maxLength={6} className="w-full pl-10 pr-3 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none text-center text-2xl font-bold tracking-[0.5em] text-gray-700" placeholder="000000" autoFocus />
//                                 </div>
//                             </div>

//                             <div className="flex gap-3 pt-2">
//                                 <button onClick={handleSubmitConfirm} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-transform active:scale-95">Xác nhận & Thanh toán</button>
//                             </div>

//                             <div className="text-center text-xs text-gray-500">
//                                 Chưa nhận được mã? <button type="button" onClick={(e) => handleSendOtp(e as any)} disabled={loading} className="text-blue-600 hover:underline font-medium disabled:text-gray-400">{loading ? 'Đang gửi...' : 'Gửi lại mã'}</button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactInfoModal;

import React, { useState } from 'react';
import { FaTimes, FaUser, FaPhone, FaEnvelope, FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import bookingApi from '../api/bookingApi';
import zaloLogo from '../assets/zalo.webp';
import { ContactData, Props } from '@/type/contact.type';

const ContactInfoModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);

    // State lưu kênh: 'email' hoặc 'zalo'
    const [otpMethod, setOtpMethod] = useState<'email' | 'zalo'>('email');

    // Khởi tạo formData
    const [formData, setFormData] = useState<ContactData & { channel?: string }>({
        name: '',
        email: '',
        phone: '',
        otp: '',
        notificationChannel: 'EMAIL'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- BƯỚC 1: GỬI OTP ---
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) {
            alert("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
            return;
        }

        // Validate email nếu chọn kênh Email
        if (otpMethod === 'email' && !formData.email) {
            alert("Bạn chọn nhận vé qua Email, vui lòng nhập địa chỉ Email!");
            return;
        }

        setLoading(true);
        try {
            const channel = otpMethod === 'email' ? 'EMAIL' : 'ZALO';
            const destination = otpMethod === 'email' ? formData.email : formData.phone;

            // Gọi API gửi OTP
            await bookingApi.requestOtp(destination, channel, 'SHOW');

            setStep(2);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Gửi OTP thất bại. Vui lòng kiểm tra lại thông tin.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // --- BƯỚC 2: XÁC NHẬN ---
    const handleSubmitConfirm = () => {
        if (!formData.otp || formData.otp.length < 6) {
            alert("Vui lòng nhập mã OTP hợp lệ (6 số)");
            return;
        }

        // 🔥 FIX QUAN TRỌNG THEO POSTMAN 🔥
        const finalData = {
            ...formData,

            // 1. Xử lý Email: Nếu chọn Zalo mà không nhập -> Gửi chuỗi rỗng "" (GIỐNG POSTMAN)
            // Tuyệt đối không gửi null hoặc undefined vì Backend @NotBlank sẽ chặn
            email: (otpMethod === 'zalo' && !formData.email) ? "" : formData.email,

            // 2. Thêm key 'channel' (GIỐNG POSTMAN)
            channel: otpMethod === 'email' ? 'EMAIL' : 'ZALO',

            // Giữ lại notificationChannel để tương thích code cũ (nếu cần)
            notificationChannel: otpMethod === 'email' ? 'EMAIL' : 'ZALO'
        };

        // console.log("Payload chuẩn bị gửi:", finalData);
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
                        <h3 className="text-lg font-bold">
                            {step === 1 ? "Thông Tin Nhận Vé" : "Xác Thực OTP"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition"><FaTimes size={20} /></button>
                </div>

                <div className="p-6">
                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nhận mã OTP và nhận vé qua:</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setOtpMethod('email'); }}
                                        className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all font-medium ${otpMethod === 'email' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        <FaEnvelope size={18} /> Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setOtpMethod('zalo'); }}
                                        className={`flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all font-medium ${otpMethod === 'zalo' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        <img src={zaloLogo} alt="Zalo" className="w-6 h-6 object-contain" /> Zalo
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                                    <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nguyễn Văn A" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0912xxxxxx" required />
                                </div>
                            </div>

                            {otpMethod === 'email' && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 border-gray-300"
                                            placeholder="email@example.com"
                                            required={otpMethod === 'email'}
                                        />
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg mt-4 flex justify-center items-center gap-2 disabled:bg-gray-400">
                                {loading ? <><FaSpinner className="animate-spin" /> Đang gửi OTP...</> : "Tiếp tục & Gửi OTP"}
                            </button>
                        </form>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
                                    {otpMethod === 'email' ? <FaEnvelope className="text-blue-600 text-2xl" /> : <img src={zaloLogo} alt="Zalo" className="w-8 h-8 object-contain" />}
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">Kiểm tra {otpMethod === 'email' ? 'Email' : 'Zalo'} của bạn</h4>
                                <p className="text-sm text-gray-500 mt-1">Mã OTP đã được gửi đến <br /><span className="font-bold text-indigo-600 text-lg">{otpMethod === 'email' ? formData.email : formData.phone}</span></p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Nhập mã xác thực (6 số)</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3.5 text-orange-500" />
                                    <input name="otp" value={formData.otp} onChange={handleChange} maxLength={6} className="w-full pl-10 pr-3 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none text-center text-2xl font-bold tracking-[0.5em] text-gray-700" placeholder="000000" autoFocus />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={handleSubmitConfirm} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-transform active:scale-95">Xác nhận & Thanh toán</button>
                            </div>

                            <div className="text-center text-xs text-gray-500">
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