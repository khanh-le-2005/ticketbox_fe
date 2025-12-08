import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaLandmark } from 'react-icons/fa';

const SightseeingPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col justify-center items-center">
        <FaLandmark className="text-6xl text-gray-300 mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Vé Tham Quan</h1>
        <p className="mt-4 text-md sm:text-lg text-gray-600 max-w-2xl">
          Dễ dàng đặt vé vào cửa các khu vui chơi, di tích, và địa điểm tham quan nổi tiếng. Tính năng đang được phát triển và sẽ sớm ra mắt.
        </p>
        <Link to="/" className="mt-8 inline-block bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
            Quay về trang chủ
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default SightseeingPage;