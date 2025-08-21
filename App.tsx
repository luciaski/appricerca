
import React, { useState, useCallback } from 'react';
import { generateReport } from './services/geminiService';
import { GroundingSource } from './types';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ReportDisplay from './components/ReportDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [report, setReport] = useState<string>('');
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchTopic: string, instructions: string) => {
    if (!searchTopic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReport('');
    setSources([]);
    setTopic(searchTopic);

    try {
      const result = await generateReport(searchTopic, instructions);
      if (result) {
        setReport(result.text);
        setSources(result.sources);
      } else {
        setError('Failed to generate report. The result was empty.');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(
        'An error occurred while generating the report. Please check the console for details or try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <Header />
        <main className="mt-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {isLoading && <Spinner />}

          {!isLoading && report && (
            <ReportDisplay topic={topic} report={report} sources={sources} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
export default App;
