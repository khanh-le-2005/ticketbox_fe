import React from "react";
import { RefreshCcw } from "lucide-react";

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 font-sans text-center relative overflow-hidden">
      
      {/* Background Decor items (Optional bubbles) */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Content Card */}
      <div className="relative z-10 max-w-lg w-full bg-white/60 backdrop-blur-lg  shadow-xl rounded-3xl p-8 md:p-12 transition-all hover:shadow-2xl">
        
        {/* Animated Sad Character SVG */}
        <div className="flex justify-center mb-8">
          <svg
            viewBox="0 0 200 200"
            className="w-40 h-40 drop-shadow-lg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Group for the head floating animation */}
            <g className="animate-[bounce_3s_infinite]">
              {/* Face Shape */}
              <circle cx="100" cy="100" r="80" fill="#FFEDD5" /> {/* Orange-100 */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#F97316" strokeWidth="4" /> {/* Orange-500 */}

              {/* Sad Eyes */}
              <ellipse cx="70" cy="90" rx="8" ry="12" fill="#4B5563" />
              <ellipse cx="130" cy="90" rx="8" ry="12" fill="#4B5563" />

              {/* Blush */}
              <circle cx="60" cy="110" r="8" fill="#FDBA74" opacity="0.6" />
              <circle cx="140" cy="110" r="8" fill="#FDBA74" opacity="0.6" />

              {/* Sad Mouth */}
              <path
                d="M 70 140 Q 100 120 130 140"
                fill="none"
                stroke="#4B5563"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Animated Tear */}
              <g className="animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]">
                 <path
                  d="M 135 100 Q 135 115 130 115 Q 125 115 125 100 Q 125 90 130 90 Q 135 90 135 100"
                  fill="#60A5FA"
                  opacity="0.8"
                  transform="translate(0, 10)"
                />
              </g>
            </g>

            {/* Helmet/Hat (Construction theme) */}
            <path 
                d="M 30 70 Q 100 -20 170 70" 
                fill="#F97316" 
                className="animate-[bounce_3s_infinite]"
            />
            <rect x="85" y="20" width="30" height="15" rx="2" fill="#FFF" className="animate-[bounce_3s_infinite]" />
          </svg>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
          Website đang bảo trì
        </h1>
        
        <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
          Hệ thống đang được nâng cấp để mang lại trải nghiệm tốt hơn cho bạn. 
          <br className="hidden md:block" />
          Chúng tôi sẽ quay lại ngay thôi!
        </p>

        {/* Action Button (Optional) */}
        {/* <button 
          onClick={() => window.location.reload()}
          className="group flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
        >
          <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Thử tải lại trang
        </button> */}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-sm text-gray-400 font-medium">
        © {new Date().getFullYear()} Mơ Màng Show
      </div>
    </div>
  );
};

export default MaintenancePage;