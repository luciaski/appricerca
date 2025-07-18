
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        AI Research Assistant
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Il tuo generatore di relazioni approfondite e podcast
      </p>
    </header>
  );
};

export default Header;
