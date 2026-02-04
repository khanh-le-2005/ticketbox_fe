// import React, { useState, useEffect } from 'react';

// type AlertType = 'success' | 'error' | 'warning' | 'info';

// interface AlertProps {
//   type?: AlertType;
//   title: string;
//   message?: string;
//   isVisible: boolean;
//   onClose: () => void;
// }

// const Alert: React.FC<AlertProps> = ({ 
//   type = 'info', 
//   title, 
//   message, 
//   isVisible, 
//   onClose 
// }) => {
//   const [show, setShow] = useState(isVisible);

//   useEffect(() => {
//     setShow(isVisible);
//   }, [isVisible]);

//   if (!show) return null;

//   // Cấu hình màu sắc và icon dựa trên Type
//   const styles = {
//     success: {
//       container: 'bg-green-50 border-green-500 text-green-800',
//       iconColor: 'text-green-500',
//       icon: (
//         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       )
//     },
//     error: {
//       container: 'bg-red-50 border-red-500 text-red-800',
//       iconColor: 'text-red-500',
//       icon: (
//         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       )
//     },
//     warning: {
//       container: 'bg-yellow-50 border-yellow-500 text-yellow-800',
//       iconColor: 'text-yellow-500',
//       icon: (
//         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//         </svg>
//       )
//     },
//     info: {
//       container: 'bg-blue-50 border-blue-500 text-blue-800',
//       iconColor: 'text-blue-500',
//       icon: (
//         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       )
//     }
//   };

//   const currentStyle = styles[type];

//   return (
//     <div className={`fixed top-5 right-5 z-50 flex w-full max-w-sm overflow-hidden rounded-lg border-l-4 bg-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${currentStyle.container}`}>
//       <div className="flex items-center justify-center w-12 bg-white/20">
//         <div className={currentStyle.iconColor}>
//           {currentStyle.icon}
//         </div>
//       </div>
      
//       <div className="-mx-3 py-2 px-4 flex-1">
//         <div className="mx-3">
//           <span className={`font-semibold ${currentStyle.iconColor}`}>{title}</span>
//           {message && <p className="text-sm opacity-90 mt-1">{message}</p>}
//         </div>
//       </div>

//       <div className="flex items-start pt-2 pr-2">
//         <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
//         >
//              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Alert;