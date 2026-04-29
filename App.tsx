// src/App.tsx

import React from 'react';
// Đổi HashRouter thành BrowserRouter để đường dẫn đẹp hơn (không có dấu #)
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
import { NewsDetailPage } from './pages/NewsDetailPage';
import BioLinkPage from './pages/BioLinkPage';
import ErrorBoundary from './components/ErrorBoundary';
import Error from './components/Error';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes >
            {/* --- PUBLIC ROUTES (Ai cũng xem được) --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/news" element={<NewsPage />} />

            {/* Chi tiết */}
            <Route path="/event/:slug" element={<EventDetailPage />} />
            <Route path="/hotel/:slug" element={<HotelDetailPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/biolink" element={<BioLinkPage />} />

            {/* Danh mục sự kiện */}
            <Route path="/music" element={<MusicPage />} />
            <Route path="/arts" element={<ArtsPage />} />
            <Route path="/tourism" element={<TourismPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/sightseeing" element={<SightseeingPage />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/error" element={<Error />} />

            {/* --- PROTECTED ROUTES (Cần đăng nhập) --- */}

            {/* Vé của tôi: Cần đăng nhập để lấy lịch sử vé từ API */}
            <Route
              path="/my-tickets"
              element={
                <MyTicketsPage />
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
          <ToastContainer
            aria-label="Notification Container"
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
export default App;
