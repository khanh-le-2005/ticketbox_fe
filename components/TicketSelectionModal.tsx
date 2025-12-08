import React, { useState, useMemo, useEffect } from 'react';
import { TicketSelectionModalProps, TicketSelection } from '../types';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

const TicketSelectionModal: React.FC<TicketSelectionModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    ticketTiers,
    eventName
}) => {

    // Create a default selection state
    const initialSelection = useMemo(() => {
        const selection: TicketSelection = {};
        ticketTiers.forEach(tier => {
            selection[tier.name] = 0;
        });
        return selection;
    }, [ticketTiers]);

    const [selection, setSelection] = useState<TicketSelection>(initialSelection);

    // Sync state if the ticket tiers prop changes
    useEffect(() => {
        setSelection(initialSelection);
    }, [initialSelection]);

    const totalSelectedTickets = useMemo(() => {
        // FIX: Operator '+' cannot be applied to types 'unknown' and 'number'. By explicitly typing `sum`, we ensure it's treated as a number.
        return Object.values(selection).reduce((sum: number, count) => sum + (count as number), 0);
    }, [selection]);

    const totalPrice = useMemo(() => {
        return ticketTiers.reduce((total: number, tier) => {
            const quantity = selection[tier.name] || 0;
            const numericPrice = Number(tier.price.replace(/[^0-9]/g, ''));
            return total + (quantity as number) * numericPrice;
        }, 0);
    }, [selection, ticketTiers]);

    if (!isOpen) return null;

    const handleQuantityChange = (tierName: string, delta: number) => {
        setSelection(prev => {
            const newQuantity = Math.max(0, (prev[tierName] || 0) + delta);
            return { ...prev, [tierName]: newQuantity };
        });
    };

    const handleConfirm = () => {
        if (totalSelectedTickets > 0) {
            onConfirm(selection, totalPrice);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
            <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-2xl relative animate-fade-in-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes size={24} />
                </button>

                {/* Header */}
                <div className="p-4 sm:p-8 bg-[#EEEEEE]">
                    <h2
                        className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center"
                        style={{ fontFamily: "serif" }}
                    >
                        Chọn Vé Của Bạn
                    </h2>

                    {/* Ticket List */}
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {ticketTiers.map(tier => (
                            <div
                                key={tier.name}
                                className="bg-white p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between"
                            >
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-lg font-bold text-yellow-500">
                                        {tier.name}
                                    </h3>
                                    <p className="text-sm">
                                        {tier.description || tier.type}
                                    </p>
                                    <p className="text-lg font-semibold mt-1">
                                        {tier.price}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4 self-end sm:self-center">
                                    <button
                                        onClick={() => handleQuantityChange(tier.name, -1)}
                                        disabled={selection[tier.name] === 0}
                                        className=" rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-400"
                                    >
                                        <FaMinus />
                                    </button>

                                    <span className="text-xl font-bold w-8 text-center">
                                        {selection[tier.name]}
                                    </span>

                                    <button
                                        onClick={() => handleQuantityChange(tier.name, 1)}
                                        className=" text-gray-900 rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-400"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-800 p-4 rounded-b-lg flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-4 sm:space-y-0">
                    <div>
                        <span className="text-gray-400">Tổng cộng:</span>
                        <p className="text-2xl font-bold text-yellow-400">
                            {totalPrice.toLocaleString('vi-VN')} VNĐ
                        </p>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={totalSelectedTickets === 0}
                        className={`w-full sm:w-auto font-bold py-3 px-8 rounded-lg text-lg transition-colors ${
                            totalSelectedTickets > 0
                                ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketSelectionModal;