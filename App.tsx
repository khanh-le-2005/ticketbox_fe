// src/App.tsx

import React from 'react';
// Đổi HashRouter thành BrowserRouter để đường dẫn đẹp hơn (không có dấu #)
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventDetailPage from './pages/EventDetailPage';
import MyTicketsPage from './pages/MyTicketsPage';
import BookingPage from './pages/BookingPage';
import HotelDetailPage from './pages/HotelDetailPage';
import DashboardPage from './pages/DashboardPage';

// Category Pages
import MusicPage from './pages/MusicPage';
import ArtsPage from './pages/ArtsPage';
import TourismPage from './pages/TourismPage';
import MoviesPage from './pages/MoviesPage';
import SightseeingPage from './pages/SightseeingPage';
import SportsPage from './pages/SportsPage';
import NewsPage from './pages/NewsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* --- PUBLIC ROUTES (Ai cũng xem được) --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/news" element={<NewsPage />} />
          
          {/* Chi tiết */}
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/booking" element={<BookingPage />} />

          {/* Danh mục sự kiện */}
          <Route path="/music" element={<MusicPage />} />
          <Route path="/arts" element={<ArtsPage />} />
          <Route path="/tourism" element={<TourismPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/sightseeing" element={<SightseeingPage />} />
          <Route path="/sports" element={<SportsPage />} />

          {/* --- PROTECTED ROUTES (Cần đăng nhập) --- */}
          
          {/* Vé của tôi: Cần đăng nhập để lấy lịch sử vé từ API */}
          <Route 
            path="/my-tickets" 
            element={
              <ProtectedRoute>
                <MyTicketsPage />
              </ProtectedRoute>
            } 
          />

          {/* Dashboard (Nếu có admin dashboard trong app này) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* --- 404 NOT FOUND --- */}
          {/* Nếu nhập đường dẫn sai, tự động quay về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;