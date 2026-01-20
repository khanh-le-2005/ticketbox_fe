export interface Banner {
  id?: string; // MongoDB ID là string, tùy chọn khi tạo mới
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
  menu?: string; // BỔ SUNG: Trường menu
  displayOrder?: number;
  isActive: boolean;
}

