
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import EventDetailPage from './pages/EventDetailPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyTicketsPage from './pages/MyTicketsPage';
import MusicPage from './pages/MusicPage';
import ArtsPage from './pages/ArtsPage';
import TourismPage from './pages/TourismPage';
import MoviesPage from './pages/MoviesPage';
import SightseeingPage from './pages/SightseeingPage';
import SportsPage from './pages/SportsPage';
import NewsPage from './pages/NewsPage';
import HotelDetailPage from './pages/HotelDetailPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-tickets" 
            element={<MyTicketsPage />} 
          />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/arts" element={<ArtsPage />} />
          <Route path="/tourism" element={<TourismPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/sightseeing" element={<SightseeingPage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;