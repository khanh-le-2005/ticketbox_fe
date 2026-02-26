import React, { useEffect, useState, useRef } from "react";
import {
  FaTimes,
  FaQrcode,
  FaSpinner,
  FaCopy,
  FaDownload,
  FaCheckCircle,
  FaInfoCircle,
  FaShieldAlt
} from "react-icons/fa";
import BookingApi from "../api/bookingApi";
import roomApi from "@/api/room_api";
import { PaymentStepModalProps } from "@/type/Otpvspay.type";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PaymentStepModal: React.FC<PaymentStepModalProps> = ({
  isOpen,
  onClose,
  paymentData,
  onPaymentSuccess,
}) => {
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [currentStatusText, setCurrentStatusText] = useState("Đang kết nối..."); // Debug UI
  const handledRef = useRef(false);
  console.log("paymentData", paymentData);
  useEffect(() => {

    if (!isOpen || !paymentData.user_id) return;

    handledRef.current = false;
    const idString = String(paymentData.user_id);

    const intervalId = setInterval(async () => {
      try {
        let isPaid = false;
        let res: any;

        if (idString.startsWith("HTL")) {
          res = await roomApi.checkPaymentStatus(idString);
        } else {
          res = await BookingApi.checkStatus(idString);
        }
        const data = res?.data || res;

        const status = String(data?.status || "").toUpperCase();
        const msg = String(res?.message ?? data?.message ?? "").toLowerCase();
        // console.log("data", data);

        // Update UI debug text
        setCurrentStatusText(`${status} (${msg})`);

        // console.log(`PaymentStepModal: Polling ${idString} -> Status: ${status}, isPaid: ${data?.isPaid ?? res?.isPaid}, message: ${msg}`, res);
        if (
          data?.isPaid ||
          ["PAID", "SUCCESS", "CONFIRMED", "COMPLETED"].includes(status) ||
          msg.includes("thành công")
        ) {
          isPaid = true;
        }

        if (isPaid && !handledRef.current) {
          handledRef.current = true;
          clearInterval(intervalId);
          onPaymentSuccess();
        }
      } catch (err: any) {
        console.error("Polling error for", idString, ":", err);
        setCurrentStatusText(`Lỗi kết nối: ${err.message || "Unknown"}`);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isOpen, paymentData, onPaymentSuccess]);
  // console.log("paymentData", paymentData);



  // --- XỬ LÝ DỮ LIỆU HIỂN THỊ ---
  // const getQrSource = (qr: string) => {
  //   if (!qr) return "";
  //   return qr.startsWith("http") ? qr : `data:image/png;base64,${qr}`;
  // };

  const getQrSource = (qr: string) => {
    if (!qr) return "";
    if (qr.startsWith("http")) return qr;
    if (qr.startsWith("data:image")) return qr; // Đã có sẵn header
    return `data:image/png;base64,${qr}`;
  };

  // const p = paymentData?.data ?? paymentData;
  // const displayAmount = p?.totalPrice || p?.amount || 0;
  // Đảm bảo các biến luôn có giá trị mặc định để không gây lỗi khi render
  const p = paymentData?.data || paymentData || {};
  const displayAmount = Number(p?.totalPrice || p?.amount || p?.totalAmount || 0);

  // const displayContent =
  //   String(p?.description || p?.payment_content || p?.bookingId || p?.orderCode || "");

  // const displayQr =
  //   p?.qrCode || p?.qr_base64 || p?.qrBase64 || "";

  // Ưu tiên hiển thị nội dung ngắn gọn
  const displayContent =
    p?.description ||
    p?.payment_content ||
    p?.bookingId ||
    paymentData?.description ||
    paymentData?.payment_content ||
    paymentData?.bookingId ||
    "";

  const displayQr =
    p?.qrCode ||
    p?.qr_base64 ||
    p?.qrBase64 ||
    paymentData?.qrCode ||
    paymentData?.qr_base64 ||
    "";

  // --- HANDLERS ---
  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopying(true);
      toast.success("Đã sao chép nội dung chuyển khoản!");
      setTimeout(() => setIsCopying(false), 1500);
    }
  };

  const handleDownloadQr = () => {
    const qrSrc = getQrSource(displayQr);
    if (!qrSrc) return;

    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = `QR_ThanhToan_${displayContent || "booking"}.png`;

    // Không cần appendChild vào body, hầu hết trình duyệt hiện đại vẫn chạy tốt
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


    toast.success("Đã tải ảnh QR!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 transition-all duration-300">

      {/* Main Card */}
      <div className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 border border-slate-100">

        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Thanh toán <span className="text-indigo-600">an toàn</span>
              <span className="text-indigo-500 text-sm"><FaShieldAlt /></span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Vui lòng không tắt màn hình này</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 pt-2">

          {/* Amount Box */}
          <div className="text-center mb-6">
            <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Tổng tiền thanh toán</span>
            <div className="text-3xl font-extrabold text-slate-800 mt-1 flex justify-center items-baseline gap-1">
              {new Intl.NumberFormat("vi-VN").format(displayAmount)}
              <span className="text-lg text-slate-500 font-semibold">₫</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="relative group flex justify-center mb-6">
            <div className="p-1 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg">
              <div className="bg-white p-3 rounded-xl relative">
                {displayQr ? (
                  <img
                    src={getQrSource(displayQr)}
                    alt="QR Payment"
                    className="w-56 h-56 object-contain mix-blend-multiply"
                  />
                ) : (
                  <div className="w-56 h-56 bg-slate-50 flex flex-col items-center justify-center text-slate-400 rounded-lg">
                    <span> <FaSpinner className="animate-spin text-2xl mb-2 text-indigo-500" /></span>
                    <span className="text-sm">Đang tạo mã QR...</span>
                  </div>
                )}

                {/* Logo Bank Center (Optional decoration) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <FaQrcode size={60} />
                </div>
              </div>
            </div>

            {/* Quick Actions floating near QR */}
            {displayQr && (
              <div className="absolute -right-2 bottom-0 flex flex-col gap-2">
                <button
                  onClick={handleDownloadQr}
                  className="w-10 h-10 bg-white border border-slate-200 text-indigo-600 rounded-full shadow-md flex items-center justify-center hover:bg-indigo-50 transition-transform hover:scale-110"
                  title="Tải ảnh QR"
                >
                  <FaDownload size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Payment Info Box */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            {/* Nội dung chuyển khoản */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Nội dung chuyển khoản</span>
                {isCopying && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><FaCheckCircle /> Đã sao chép</span>}
              </div>
              <div
                className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-indigo-300 transition-colors group"
                onClick={() => handleCopy(displayContent)}
              >
                <span className="font-mono font-bold text-slate-700 truncate mr-2 select-all">
                  {displayContent}
                </span>
                <span><FaCopy className="text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" /></span>
              </div>
              <p className="text-[10px] text-orange-500 mt-1.5 flex items-center gap-1">
                <FaInfoCircle /> Lưu ý: Nhập chính xác nội dung này để đơn hàng được duyệt tự động.
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-6 flex items-center justify-center gap-3 py-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-medium text-indigo-700">
              Hệ thống đang kiểm tra... <br />
              <span className="text-xs text-indigo-500 font-normal">Trạng thái: {currentStatusText}</span>
            </span>
          </div>

        </div>

        {/* Footer Text */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Gặp sự cố? Liên hệ hotline hỗ trợ ngay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStepModal;