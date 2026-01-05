// src/components/PaymentStepModal.tsx

import React, { useEffect, useState } from "react";
import { FaTimes, FaQrcode, FaSpinner, FaCopy } from "react-icons/fa";
import BookingApi from "../api/bookingApi";
import roomApi from "@/api/room_api"; // Đảm bảo đường dẫn import đúng file roomApi.ts

interface PaymentStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: any;
  onPaymentSuccess: () => void;
}

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
