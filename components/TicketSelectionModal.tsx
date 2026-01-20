// src/components/TicketSelectionModal.tsx

import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { TicketSelection } from '../types';
import { TicketTier, TicketSelectionModalProps } from '@/type/Tickets.type';

// interface TicketTier {
//     name: string;      // Mã vé (VIP, STD...)
//     displayName?: string; // Tên hiển thị (Vé VIP...) - Nếu bạn có thêm trường này
//     price: number;
//     available: number;
// }

// interface TicketSelectionModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: (selection: TicketSelection, total: number) => void;
//     ticketTiers: TicketTier[];
//     eventName: string;
// }

const TicketSelectionModal: React.FC<TicketSelectionModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    ticketTiers,
    eventName
}) => {
    const [selection, setSelection] = useState<TicketSelection>({});

    // Reset selection khi mở modal
    useEffect(() => {
        if (isOpen) {
            const initialSelection: TicketSelection = {};
            ticketTiers.forEach(tier => {
                initialSelection[tier.name] = 0;
            });
            setSelection(initialSelection);
        }
    }, [isOpen, ticketTiers]);

    const handleQuantityChange = (tierName: string, change: number) => {
        setSelection(prev => {
            const currentQty = prev[tierName] || 0;
            const tier = ticketTiers.find(t => t.name === tierName);
            if (!tier) return prev;

            const newQty = Math.max(0, Math.min(tier.available, currentQty + change));
            return { ...prev, [tierName]: newQty };
        });
    };

    const calculateTotal = () => {
        return ticketTiers.reduce((total, tier) => {
            return total + (selection[tier.name] || 0) * tier.price;
        }, 0);
    };

    const totalTickets = Object.values(selection).reduce((a: number, b: number) => a + b, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] overflow-y-auto">
            {/* Backdrop mờ */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

                    {/* Header: Màu tím xanh như trong ảnh */}
                    <div className="bg-[#5143f2] px-4 py-6 sm:px-6 relative">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white hover:text-gray-200"
                        >
                            <FaTimes size={24} />
                        </button>
                        <h3 className="text-2xl font-black leading-6 text-white text-center uppercase tracking-wide">
                            Chọn Vé
                        </h3>
                        <p className="mt-3 text-xs text-indigo-100 text-center font-medium uppercase tracking-wider px-8">
                            {eventName}
                        </p>
                    </div>

                    {/* Body: Danh sách vé */}
                    <div className="px-4 py-5 sm:p-6 bg-gray-50 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-4">
                            {ticketTiers.map((tier) => {
                                const qty = selection[tier.name] || 0;
                                const isMax = qty >= tier.available;

                                return (
                                    <div key={tier.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">

                                        {/* Thông tin vé (Bên trái) */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-400 text-xl">🎫</span>
                                                <h4 className="font-extrabold text-gray-900 text-lg uppercase">
                                                    {tier.displayName || tier.name}
                                                </h4>
                                            </div>
                                            <p className="text-[#5143f2] font-extrabold text-xl mt-2">
                                                {new Intl.NumberFormat('vi-VN').format(tier.price)} <span className="underline decoration-2">đ</span>
                                            </p>
                                            <p className="text-[10px] text-green-500 font-bold mt-2 uppercase">
                                                Còn lại: {tier.available} vé
                                            </p>
                                        </div>

                                        {/* Nút tăng giảm (Bên phải) */}
                                        <div className="flex items-center gap-4">
                                            {/* Nút TRỪ */}
                                            <button
                                                onClick={() => handleQuantityChange(tier.name, -1)}
                                                disabled={qty === 0}
                                                className={`
                                                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                                                    ${qty === 0
                                                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
                                                `}
                                            >
                                                <FaMinus size={14} />
                                            </button>

                                            {/* Số lượng */}
                                            <span className="font-black text-gray-900 w-6 text-center text-xl">
                                                {qty}
                                            </span>

                                            {/* Nút CỘNG */}
                                            <button
                                                onClick={() => handleQuantityChange(tier.name, 1)}
                                                disabled={isMax}
                                                className={`
                                                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                                                    ${isMax
                                                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                        : 'bg-[#d8dfff] text-[#5143f2] hover:bg-[#c5cdff]'}
                                                `}
                                            >
                                                <FaPlus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer: Tổng tiền & Nút Tiếp tục */}
                    <div className="bg-white px-6 py-6 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Tổng thanh toán</p>
                            <p className="text-2xl font-black text-orange-500 mt-1">
                                {new Intl.NumberFormat('vi-VN').format(calculateTotal())} <span className="underline decoration-2 text-lg">đ</span>
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onConfirm(selection, calculateTotal())}
                            disabled={totalTickets === 0}
                            className={`
                                rounded-xl px-8 py-4 text-xl font-black shadow-lg transition-all
                                ${totalTickets === 0
                                    ? 'bg-[#ffca99] text-white cursor-not-allowed'
                                    : 'bg-[#ffab5c] text-white hover:bg-[#ff9a3d] hover:shadow-xl transform active:scale-95'}
                            `}
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketSelectionModal;