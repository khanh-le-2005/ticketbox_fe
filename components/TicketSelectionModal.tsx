// src/components/TicketSelectionModal.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { TicketSelectionModalProps, TicketSelection } from '../types';
import { FaTimes, FaPlus, FaMinus, FaTicketAlt } from 'react-icons/fa';

const TicketSelectionModal: React.FC<TicketSelectionModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    ticketTiers,
    eventName
}) => {

    // Khởi tạo state
    const initialSelection = useMemo(() => {
        const selection: TicketSelection = {};
        ticketTiers.forEach(tier => {
            selection[tier.name] = 0;
        });
        return selection;
    }, [ticketTiers]);

    const [selection, setSelection] = useState<TicketSelection>(initialSelection);

    // Reset khi mở lại
    useEffect(() => {
        if (isOpen) {
            setSelection(initialSelection);
        }
    }, [isOpen, initialSelection]);

    // Tính tổng vé
    const totalSelectedTickets = useMemo(() => {
        return Object.values(selection).reduce((sum: number, count) => sum + (count as number), 0);
    }, [selection]);

    // Tính tổng tiền (FIX LỖI: Xử lý cả trường hợp giá là string hoặc number)
    const totalPrice = useMemo(() => {
        return ticketTiers.reduce((total: number, tier) => {
            const quantity = selection[tier.name] || 0;
            
            let priceVal = 0;
            if (typeof tier.price === 'number') {
                priceVal = tier.price;
            } else if (typeof tier.price === 'string') {
                // Xóa ký tự không phải số nếu là string (VD: "100.000 đ")
                priceVal = Number(tier.price.replace(/[^0-9]/g, ''));
            }

            return total + (quantity as number) * priceVal;
        }, 0);
    }, [selection, ticketTiers]);

    if (!isOpen) return null;

    const handleQuantityChange = (tierName: string, delta: number) => {
        setSelection(prev => {
            const currentQty = prev[tierName] || 0;
            // Kiểm tra số lượng tồn kho (nếu có trường available)
            const tier = ticketTiers.find(t => t.name === tierName);
            const maxQty = tier && (tier as any).available !== undefined ? (tier as any).available : 99;

            const newQuantity = Math.max(0, Math.min(currentQty + delta, maxQty));
            return { ...prev, [tierName]: newQuantity };
        });
    };

    const handleConfirm = () => {
        if (totalSelectedTickets > 0) {
            onConfirm(selection, totalPrice);
        }
    };

    // Helper format tiền hiển thị
    const formatPrice = (price: number | string) => {
        const val = typeof price === 'string' ? Number(price.replace(/[^0-9]/g, '')) : price;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-indigo-600 p-6 text-center relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-1">Chọn Vé</h2>
                    <p className="text-indigo-100 text-sm truncate px-8">{eventName}</p>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        {ticketTiers.map(tier => {
                            // Xử lý hiển thị tồn kho (nếu có)
                            // @ts-ignore
                            const available = tier.available !== undefined ? tier.available : 999;
                            const isSoldOut = available <= 0;

                            return (
                                <div
                                    key={tier.name}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between ${
                                        (selection[tier.name] || 0) > 0 
                                        ? 'border-orange-500 bg-orange-50' 
                                        : 'border-gray-100 hover:border-indigo-200'
                                    } ${isSoldOut ? 'opacity-60 bg-gray-50' : ''}`}
                                >
                                    <div className="mb-4 sm:mb-0 text-center sm:text-left w-full sm:w-auto">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center sm:justify-start">
                                            <FaTicketAlt className={`mr-2 ${isSoldOut ? 'text-gray-400' : 'text-orange-500'}`} />
                                            {tier.name}
                                        </h3>
                                        <p className="text-indigo-600 font-bold text-lg mt-1">
                                            {formatPrice(tier.price)}
                                        </p>
                                        {isSoldOut ? (
                                            <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded">HẾT VÉ</span>
                                        ) : (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {tier.description || "Vé vào cổng trực tiếp"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3 bg-white p-1 rounded-full shadow-sm border border-gray-200">
                                        <button
                                            onClick={() => handleQuantityChange(tier.name, -1)}
                                            disabled={!selection[tier.name] || isSoldOut}
                                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FaMinus size={12} />
                                        </button>

                                        <span className="text-lg font-bold w-8 text-center text-gray-800">
                                            {selection[tier.name] || 0}
                                        </span>

                                        <button
                                            onClick={() => handleQuantityChange(tier.name, 1)}
                                            disabled={isSoldOut || (selection[tier.name] || 0) >= available}
                                            className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FaPlus size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-100 p-6 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                        <span className="text-gray-500 text-sm block">Tổng thanh toán</span>
                        <span className="text-2xl font-bold text-orange-600 block leading-none">
                            {totalPrice.toLocaleString('vi-VN')} ₫
                        </span>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={totalSelectedTickets === 0}
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        Tiếp tục ({totalSelectedTickets})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketSelectionModal;