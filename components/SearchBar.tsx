
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (topic: string, instructions: string) => void;
  isLoading: boolean;
}

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const OptionsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
);


const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [instructionsValue, setInstructionsValue] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSearch(inputValue, instructionsValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Inserisci un argomento di interesse..."
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 disabled:opacity-50"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-300 disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generazione...' : 'Crea Report'}
            </button>
        </div>
        <div className="flex flex-col gap-2">
            <button 
                type="button" 
                onClick={() => setShowInstructions(!showInstructions)} 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors self-start"
                aria-expanded={showInstructions}
            >
                <OptionsIcon className="w-5 h-5" />
                <span>{showInstructions ? 'Nascondi istruzioni personalizzate' : 'Aggiungi istruzioni personalizzate'}</span>
            </button>
            {showInstructions && (
                <textarea
                    value={instructionsValue}
                    onChange={(e) => setInstructionsValue(e.target.value)}
                    placeholder="Istruzioni opzionali per l'IA (es. 'Scrivi un report di 500 parole', 'Concentrati sugli aspetti economici', 'Usa uno stile informale')"
                    disabled={isLoading}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 disabled:opacity-50 animate-fade-in"
                    rows={3}
                    aria-label="Istruzioni personalizzate per l'IA"
                />
            )}
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.3s ease-out forwards;
            }
        `}</style>
    </form>
  );
};

export default SearchBar;
