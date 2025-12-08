import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaFutbol } from 'react-icons/fa';

const SportsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col justify-center items-center">
        <FaFutbol className="text-6xl text-gray-300 mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Sự Kiện Thể Thao</h1>
        <p className="mt-4 text-md sm:text-lg text-gray-600 max-w-2xl">
          Đừng bỏ lỡ những trận cầu đỉnh cao và các sự kiện thể thao hấp dẫn. Tính năng đặt vé thể thao sẽ sớm có mặt trên TicketGo.
        </p>
        <Link to="/" className="mt-8 inline-block bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
            Quay về trang chủ
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default SportsPage;