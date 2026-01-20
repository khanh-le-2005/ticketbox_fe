import React from "react";
import zaloLogo from "../assets/zalo.webp";
const FloatButton: React.FC = () => {
  return (
    <>
      {/* 👇 ZALO BUTTON 👇 */}
      <a
        href="https://zalo.me/0929009999"
        target="_blank"
        rel="noopener noreferrer"
        // Mobile: bottom-4 right-4 | Desktop: bottom-8 right-8
        className="fixed bottom-4 right-4 md:bottom-10 md:right-8 z-50 group"
        title="Chat Zalo ngay"
      >
        {/* Mobile: w-10 h-10 (40px) | Desktop: w-14 h-14 (56px) */}
        <div className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-blue-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 ring-2 md:ring-4 ring-white">
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
          <img
            src={zaloLogo}
            alt="Zalo"
            // Mobile: w-5 h-5 | Desktop: w-8 h-8
            className="w-5 h-5 md:w-8 md:h-8 object-contain relative z-10"
          />
          {/* Tooltip (chỉ hiện trên desktop để đỡ rối mobile) */}
          <span className="hidden md:block absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Tư vấn ngay
          </span>
        </div>
      </a>

      {/* 👇 PHONE BUTTON 👇 */}
      <a
        href="tel:0929009999"
        // Mobile: bottom-16 (cách nút Zalo 1 đoạn vừa đủ) | Desktop: bottom-28
        className="fixed bottom-20 right-4 md:bottom-28 md:right-8 z-50 group"
        title="Gọi ngay"
      >
        {/* Mobile: w-10 h-10 | Desktop: w-14 h-14 */}
        <div className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-green-500 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 ring-2 md:ring-4 ring-white">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            // Mobile: w-5 h-5 | Desktop: w-7 h-7
            className="w-5 h-5 md:w-7 md:h-7 text-white relative z-10 animate-bounce-slow"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
          <span className="hidden md:block absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Gọi ngay
          </span>
        </div>
      </a>
    </>
  );
};

export default FloatButton;
