// src/components/ScrollToTop.tsx

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang ngay lập tức (0, 0)
    // Dùng behavior 'instant' để tránh hiệu ứng trượt chậm gây cảm giác lag khi chuyển trang
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior // Ép kiểu để TS không báo lỗi
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;