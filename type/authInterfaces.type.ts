
export interface LoginRequestDTO {
  identifier: string; // Email hoặc Username
  password: string;
}

export interface AuthResponseDTO {
  token?: string;
  accessToken?: string;
  type?: string;
  id?: string;
  username?: string;
  email?: string;
  roles?: string[];
}

// --- REGISTER (Đúng yêu cầu của bạn) ---
export interface RegisterRequestDTO {
  username: string;
  email: string;
  phone: string;
  password: string;
  fullName: string;
  // Không có field role
}

// --- PROFILE & PASSWORD ---
export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfileDTO {
  id: string;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  avatar?: string;
}