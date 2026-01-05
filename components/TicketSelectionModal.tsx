// src/components/TicketSelectionModal.tsx

import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { TicketSelection } from '../types';

interface TicketTier {
    name: string;      // Mã vé (VIP, STD...)
    displayName?: string; // Tên hiển thị (Vé VIP...) - Nếu bạn có thêm trường này
    price: number;
    available: number;
}

interface TicketSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selection: TicketSelection, total: number) => void;
    ticketTiers: TicketTier[];
    eventName: string;
}

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

    const totalTickets = Object.values(selection).reduce((a, b) => a + b, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop mờ */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    
                    {/* Header: Màu tím xanh như trong ảnh */}
                    <div className="bg-indigo-600 px-4 py-4 sm:px-6 relative">
                        <button 
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white hover:text-gray-200"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h3 className="text-xl font-bold leading-6 text-white text-center">
                            Chọn Vé
                        </h3>
                        <p className="mt-1 text-sm text-indigo-100 text-center">
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
                                    <div key={tier.name} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center justify-between">
                                        
                                        {/* Thông tin vé (Bên trái) */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-500 text-lg">🎫</span>
                                                {/* Ưu tiên hiện DisplayName nếu có, ko thì hiện Name (VIP, STD) */}
                                                <h4 className="font-bold text-gray-900 text-lg uppercase">
                                                    {tier.displayName || tier.name}
                                                </h4>
                                            </div>
                                            <p className="text-indigo-600 font-bold text-lg mt-1">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tier.price)}
                                            </p>
                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                Còn lại: {tier.available} vé
                                            </p>
                                        </div>

                                        {/* Nút tăng giảm (Bên phải) - ĐÃ SỬA CĂN CHỈNH */}
                                        <div className="flex items-center gap-3">
                                            {/* Nút TRỪ */}
                                            <button
                                                onClick={() => handleQuantityChange(tier.name, -1)}
                                                disabled={qty === 0}
                                                className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                                    ${qty === 0 
                                                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                                `}
                                            >
                                                <FaMinus size={12} />
                                            </button>

                                            {/* Số lượng */}
                                            <span className="font-bold text-gray-900 w-8 text-center text-lg">
                                                {qty}
                                            </span>

                                            {/* Nút CỘNG */}
                                            <button
                                                onClick={() => handleQuantityChange(tier.name, 1)}
                                                disabled={isMax}
                                                className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                                    ${isMax
                                                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}
                                                `}
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer: Tổng tiền & Nút Tiếp tục */}
                    <div className="bg-white px-4 py-4 sm:px-6 border-t border-gray-200 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tổng thanh toán</p>
                            <p className="text-xl font-bold text-orange-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onConfirm(selection, calculateTotal())}
                            disabled={totalTickets === 0}
                            className={`
                                rounded-lg px-6 py-3 text-base font-semibold shadow-sm transition-all
                                ${totalTickets === 0
                                    ? 'bg-orange-300 text-white cursor-not-allowed'
                                    : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transform active:scale-95'}
                            `}
                        >
                            Tiếp tục ({totalTickets})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketSelectionModal;