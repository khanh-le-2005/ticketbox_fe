// // src/components/PaymentStepModal.tsx

import React, { useEffect, useState } from "react";
import { FaTimes, FaQrcode, FaSpinner, FaCopy } from "react-icons/fa";
import BookingApi from "../api/bookingApi";
import roomApi from "@/api/room_api"; // Đảm bảo đường dẫn import đúng file roomApi.ts
import { PaymentStepModalProps } from "@/type/Otpvspay.type";
// interface PaymentStepModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   paymentData: any;
//   onPaymentSuccess: () => void;
// }

const PaymentStepModal: React.FC<PaymentStepModalProps> = ({
  isOpen,
  onClose,
  paymentData,
  onPaymentSuccess,
}) => {
  useEffect(() => {
    // Lấy ID từ dữ liệu trả về
    const rawId =
      paymentData?.id || paymentData?.bookingId || paymentData?.payment_content;

    if (!isOpen || !rawId) return;

    console.log("🔄 Bắt đầu polling cho:", rawId);

    const intervalId = setInterval(async () => {
      try {
        let isPaid = false;
        let idString = String(rawId);

        // --- SỬA LỖI TẠI ĐÂY: XỬ LÝ ID TRƯỚC KHI GỌI API ---

        // Nếu là đơn Khách sạn (Có tiền tố HTL hoặc TG-)
        if (
          idString.startsWith("TG-") ||
          idString.startsWith("HTL") ||
          paymentData.roomTypeCode ||
          paymentData.hotel
        ) {
          // 1. CẮT BỎ TIỀN TỐ 'HTL' NẾU CÓ
          // Backend thường chỉ nhận ObjectId (24 ký tự) cho endpoint /status
          let cleanId = idString;
          if (cleanId.startsWith("HTL")) {
            cleanId = cleanId.replace("HTL", "");
          }

          // Gọi API với ID đã làm sạch (Ví dụ: 695787...)
          // console.log("Calling API with ID:", cleanId);
          const res: any = await roomApi.checkPaymentStatus(cleanId);

          const data = res.data?.data || res.data || res;

          // Kiểm tra kết quả
          if (data && (data.paid === true || data.status === "CONFIRMED")) {
            isPaid = true;
          }
        } else {
          // Logic cũ (Vé sự kiện)
          const res: any = await BookingApi.checkStatus(idString);
          if (res.data && res.data.isPaid === true) {
            isPaid = true;
          }
        }

        if (isPaid) {
          clearInterval(intervalId);
          onPaymentSuccess();
        }
      } catch (error: any) {
        // Log lỗi chi tiết để debug nếu vẫn bị 400
        // console.warn("Polling error:", error.response?.data || error.message);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isOpen, paymentData, onPaymentSuccess]);

  // --- PHẦN GIAO DIỆN (GIỮ NGUYÊN Y HỆT CŨ) ---

  const getQrSource = (qr: string) => {
    if (!qr) return "";
    return qr.startsWith("http") ? qr : `data:image/png;base64,${qr}`;
  };

  const displayAmount = paymentData?.totalPrice || paymentData?.amount || 0;
  const displayContent =
    paymentData?.description ||
    paymentData?.payment_content ||
    paymentData?.bookingId;
  const displayQr = paymentData?.qrCode || paymentData?.qr_base64;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header cũ */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaQrcode /> Quét Mã Thanh Toán
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 text-center space-y-5">
          {/* Box tiền cũ */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-gray-600 text-sm">Số tiền cần thanh toán</p>
            <p className="text-3xl font-bold text-orange-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(displayAmount)}
            </p>
          </div>

          {/* Box QR cũ */}
          <div className="flex justify-center">
            <div className="p-2 border-2 border-indigo-100 rounded-lg bg-white shadow-sm">
              {displayQr ? (
                <img
                  src={getQrSource(displayQr)}
                  alt="QR Payment"
                  className="w-64 h-64 object-contain"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                  <FaSpinner className="animate-spin mr-2" /> Đang tạo mã QR...
                </div>
              )}
            </div>
          </div>

          {/* Box nội dung cũ */}
          <div className="text-sm bg-gray-100 p-3 rounded text-left">
            <p className="text-gray-500 mb-1">Nội dung chuyển khoản:</p>
            <div className="flex justify-between items-center font-mono font-bold text-gray-800">
              <span>{displayContent}</span>
              <FaCopy
                className="cursor-pointer hover:text-indigo-600"
                onClick={() => {
                  navigator.clipboard.writeText(displayContent);
                  alert("Đã copy nội dung!");
                }}
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">
            Hệ thống sẽ tự động chuyển trang sau khi nhận được tiền.
          </p>

          {/* Button cũ */}
          <button
            disabled
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 opacity-90"
          >
            <FaSpinner className="animate-spin" /> Đang chờ thanh toán...
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStepModal;


// import React, { useEffect, useState, useRef } from "react";
// import { FaTimes, FaQrcode, FaSpinner, FaCopy, FaDownload, FaMobileAlt } from "react-icons/fa";
// import BookingApi from "../api/bookingApi";
// import roomApi from "@/api/room_api"; 

// interface PaymentStepModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   paymentData: any;
//   onPaymentSuccess: () => void;
// }

// // Danh sách Deeplink các ngân hàng phổ biến (Dựa trên tài liệu VietQR)
// // Bạn có thể bổ sung thêm từ https://www.vietqr.io/danh-sach-api/deeplink-app-ngan-hang/
// const BANK_APPS = [
//   { name: "MBBank", scheme: "mbmobile://", icon: "https://img.vietqr.io/image/970422-logo.png" }, // Logo mẫu, nên thay bằng static assets
//   { name: "Vietcombank", scheme: "vcbdigibank://", icon: "https://img.vietqr.io/image/970436-logo.png" },
//   { name: "Techcombank", scheme: "tcb://", icon: "https://img.vietqr.io/image/970407-logo.png" },
//   { name: "ACB", scheme: "acbapp://", icon: "https://img.vietqr.io/image/970416-logo.png" },
//   { name: "VPBank", scheme: "vpbankneo://", icon: "https://img.vietqr.io/image/970432-logo.png" },
//   { name: "TPBank", scheme: "tpbankmobile://", icon: "https://img.vietqr.io/image/970423-logo.png" },
//   { name: "MoMo", scheme: "momo://", icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
// ];

// const PaymentStepModal: React.FC<PaymentStepModalProps> = ({
//   isOpen,
//   onClose,
//   paymentData,
//   onPaymentSuccess,
// }) => {
//   const [isMobile, setIsMobile] = useState(false);
  
//   // Dùng Ref để giữ interval ID, tránh re-render gây duplicate interval
//   const pollingInterval = useRef<NodeJS.Timeout | null>(null);

//   // Detect Mobile
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Xử lý Polling kiểm tra trạng thái
//   useEffect(() => {
//     // Lấy ID từ dữ liệu trả về
//     const rawId = paymentData?.id || paymentData?.bookingId || paymentData?.payment_content;

//     if (!isOpen || !rawId) return;

//     // Hàm kiểm tra trạng thái đơn lẻ
//     const checkStatus = async () => {
//       try {
//         let isPaid = false;
//         let idString = String(rawId);

//         // --- LOGIC XỬ LÝ ID MỚI ---
//         const isHotelBooking = 
//           idString.startsWith("TG-") || 
//           idString.startsWith("HTL") || 
//           paymentData.roomTypeCode || 
//           paymentData.hotel;

//         if (isHotelBooking) {
//           // 1. Cắt bỏ tiền tố HTL để lấy ID sạch (ObjectId 24 chars)
//           let cleanId = idString.replace("HTL", "");
          
//           // Gọi API Room
//           const res: any = await roomApi.checkPaymentStatus(cleanId);
//           const data = res.data?.data || res.data || res;

//           if (data && (data.paid === true || data.status === "CONFIRMED")) {
//             isPaid = true;
//           }
//         } else {
//           // Logic Vé sự kiện
//           const res: any = await BookingApi.checkStatus(idString);
//           if (res.data && res.data.isPaid === true) {
//             isPaid = true;
//           }
//         }

//         if (isPaid) {
//           if (pollingInterval.current) clearInterval(pollingInterval.current);
//           onPaymentSuccess();
//         }
//       } catch (error: any) {
//         // console.warn("Polling error (có thể bỏ qua nếu đang chờ user pay):", error.message);
//       }
//     };

//     console.log("🔄 Bắt đầu polling cho:", rawId);
    
//     // Gọi ngay lần đầu
//     checkStatus();
    
//     // Set interval 3s
//     pollingInterval.current = setInterval(checkStatus, 3000);

//     return () => {
//       if (pollingInterval.current) clearInterval(pollingInterval.current);
//     };
//   }, [isOpen, paymentData, onPaymentSuccess]);

//   // --- HELPER FUNCTIONS ---

//   const getQrSource = (qr: string) => {
//     if (!qr) return "";
//     return qr.startsWith("http") ? qr : `data:image/png;base64,${qr}`;
//   };

//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//     // Có thể thay bằng Toast notification
//     alert("Đã sao chép: " + text); 
//   };

//   const handleDownloadQr = () => {
//     const qrSrc = getQrSource(displayQr);
//     if (!qrSrc) return;
//     const link = document.createElement("a");
//     link.href = qrSrc;
//     link.download = `QR_Payment_${displayContent}.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Mở App ngân hàng thông qua Deeplink
//   const handleOpenBankApp = (scheme: string) => {
//     // Lưu ý: Deeplink chỉ mở App, user vẫn cần quét QR hoặc nhập tay nếu App không hỗ trợ parse tham số qua link
//     // Để tối ưu nhất: User nên "Tải ảnh QR" -> Mở App -> Chọn "Quét từ thư viện"
//     window.location.href = scheme;
//   };

//   // --- RENDER DATA ---
//   const displayAmount = paymentData?.totalPrice || paymentData?.amount || 0;
//   const displayContent = paymentData?.description || paymentData?.payment_content || paymentData?.bookingId || "";
//   const displayQr = paymentData?.qrCode || paymentData?.qr_base64;

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm overflow-y-auto">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
        
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex justify-between items-center shadow-md">
//           <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
//             <FaQrcode /> Thanh Toán QR
//           </h3>
//           <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
//             <FaTimes size={24} />
//           </button>
//         </div>

//         <div className="p-4 md:p-6 space-y-5">
          
//           {/* Số tiền */}
//           <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
//             <p className="text-gray-500 text-xs md:text-sm uppercase tracking-wide">Tổng thanh toán</p>
//             <p className="text-3xl md:text-4xl font-extrabold text-orange-600 mt-1">
//               {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(displayAmount)}
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Cột Trái: QR Code */}
//             <div className="flex flex-col items-center space-y-3">
//                 <div className="relative group">
//                     <div className="p-2 border-2 border-indigo-50 rounded-xl bg-white shadow-sm">
//                     {displayQr ? (
//                         <img
//                         src={getQrSource(displayQr)}
//                         alt="QR Payment"
//                         className="w-48 h-48 md:w-40 md:h-40 object-contain"
//                         />
//                     ) : (
//                         <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
//                         <div className="text-center">
//                             <FaSpinner className="animate-spin mx-auto mb-2 text-2xl" />
//                             Creating QR...
//                         </div>
//                         </div>
//                     )}
//                     </div>
//                     {/* Nút download đè lên ảnh khi hover (Desktop) hoặc luôn hiện (nếu muốn) */}
//                     {displayQr && (
//                         <button 
//                             onClick={handleDownloadQr}
//                             className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg text-indigo-600 hover:text-indigo-800 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
//                             title="Tải ảnh QR"
//                         >
//                             <FaDownload />
//                         </button>
//                     )}
//                 </div>
                
//                 {/* Nút tải cho Mobile (rõ ràng hơn) */}
//                 <button 
//                     onClick={handleDownloadQr}
//                     className="md:hidden flex items-center gap-2 text-sm text-indigo-600 font-semibold bg-indigo-50 px-4 py-2 rounded-full"
//                 >
//                     <FaDownload /> Lưu ảnh QR
//                 </button>
//             </div>

//             {/* Cột Phải: Thông tin & Deeplink */}
//             <div className="flex flex-col justify-between space-y-4">
//                 {/* Thông tin chuyển khoản */}
//                 <div className="space-y-3">
//                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
//                         <p className="text-xs text-gray-500 mb-1">Nội dung chuyển khoản (Bắt buộc)</p>
//                         <div className="flex justify-between items-center">
//                             <span className="font-mono font-bold text-gray-800 text-sm break-all mr-2">
//                                 {displayContent}
//                             </span>
//                             <button 
//                                 onClick={() => handleCopy(displayContent)}
//                                 className="text-gray-400 hover:text-indigo-600 p-1"
//                                 title="Copy"
//                             >
//                                 <FaCopy size={18} />
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Deeplink Section - Chỉ hiện hoặc làm nổi bật trên Mobile */}
//                 <div className="bg-blue-50 rounded-xl p-3">
//                     <div className="flex items-center gap-2 mb-2 text-blue-800 text-xs font-bold uppercase">
//                         <FaMobileAlt /> Mở App ngân hàng
//                     </div>
//                     <div className="grid grid-cols-4 gap-2">
//                         {BANK_APPS.map((bank) => (
//                             <button
//                                 key={bank.name}
//                                 onClick={() => handleOpenBankApp(bank.scheme)}
//                                 className="flex flex-col items-center p-1 hover:bg-white rounded-lg transition-colors"
//                                 title={`Mở ${bank.name}`}
//                             >
//                                 {/* Dùng placeholder icon nếu không có ảnh thật */}
//                                 <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
//                                     {bank.icon ? <img src={bank.icon} alt={bank.name} className="w-full h-full object-cover" /> : <span className="text-[8px]">{bank.name}</span>}
//                                 </div>
//                                 <span className="text-[9px] mt-1 text-gray-600 font-medium truncate w-full text-center">{bank.name}</span>
//                             </button>
//                         ))}
//                     </div>
//                     <p className="text-[10px] text-gray-500 mt-2 text-center italic">
//                         *Lưu ý: Bạn cần "Lưu ảnh QR" trước nếu App yêu cầu quét từ thư viện ảnh.
//                     </p>
//                 </div>
//             </div>
//           </div>

//           {/* Footer Status */}
//           <div className="pt-2">
//             <button
//                 disabled
//                 className="w-full bg-gray-100 text-indigo-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 cursor-wait border border-indigo-100"
//             >
//                 <FaSpinner className="animate-spin text-indigo-600" /> 
//                 Đang chờ hệ thống xác nhận...
//             </button>
//             <p className="text-center text-xs text-gray-400 mt-2">
//                 Giao dịch sẽ tự động hoàn tất sau khi bạn chuyển khoản thành công.
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentStepModal;






