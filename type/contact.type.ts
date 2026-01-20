export interface ContactData {
    name: string;
    email: string | null;
    phone: string;
    otp: string;
    notificationChannel: 'EMAIL' | 'ZALO';
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