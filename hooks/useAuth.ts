// src/hooks/useAuth.ts

import { useContext } from 'react';
// Import cả Context và Type từ file AuthContext để đảm bảo đồng bộ dữ liệu
import { AuthContext, AuthContextType } from '../context/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};