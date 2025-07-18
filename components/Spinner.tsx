
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        <div className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 border-4 border-dashed rounded-full animate-spin border-teal-400 animate-reverse-spin"></div>
        <p className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-gray-400">Analizzando...</p>
      </div>
       <style>{`
        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
        }
        .animate-reverse-spin {
          animation: reverse-spin 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Spinner;
