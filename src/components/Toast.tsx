import React from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => (
  <div
    className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}
  >
    <div className="bg-black/80 text-white text-[11px] font-bold px-5 py-2.5 rounded-full shadow-xl whitespace-nowrap backdrop-blur-sm">
      {message}
    </div>
  </div>
);
