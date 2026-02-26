
import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok  } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white mt-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-indigo-400">
                            MƠ MÀNG <span className="text-orange-400">SHOW</span>
                        </h3>
                        <p className="text-sm text-gray-400 mt-2">Giai điệu bồng bềnh, tìm MƠ MÀNG SHOW. Nền tảng đặt vé sự kiện, tour du lịch, và vé tham quan hàng đầu Việt Nam.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Về MƠ MÀNG SHOW </h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white">Về chúng tôi</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Chính sách bảo mật</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Hỗ trợ khách hàng</h4>
                         <ul className="space-y-2 text-sm">
                            {/* <li><a href="#" className="text-gray-400 hover:text-white">Câu hỏi thường gặp</a></li> */}
                            <li><a href="#" className="text-gray-400 hover:text-white">Hotline: 0929009999</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Email: momangshow@gmail.com</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Kết nối với chúng tôi</h4>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/momangshowtamdao" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
                            <a href="https://www.instagram.com/momangtamdao/" className="text-gray-400 hover:text-white"><FaInstagram size={24} /></a>
                            <a href=" https://www.youtube.com/@momangshow " className="text-gray-400 hover:text-white"><FaYoutube size={24} /></a>
                            <a href=" https://www.tiktok.com/@momangshow " className="text-gray-400 hover:text-white"><FaTiktok  size={20} /></a>

                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-900 py-4">
                <p className="text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} momangshow. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
