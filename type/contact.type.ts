export interface ContactData {
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    otp: string;
    channel: string
}

export interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ContactData) => void;
}

export interface HotelContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ContactData) => void;
}