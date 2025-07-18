import React, { useState, useMemo } from 'react';
import { GroundingSource } from '../types';
import { generatePdf, cleanMarkdownForPlainText } from '../utils/pdfGenerator';
import PodcastPlayer from './PodcastPlayer';
import Markdown from 'react-markdown';
import { DownloadIcon, PodcastIcon, ShareIcon, SourceIcon } from './Icons';

interface ReportDisplayProps {
  topic: string;
  report: string;
  sources: GroundingSource[];
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ topic, report, sources }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPodcast, setShowPodcast] = useState(false);

  const plainTextReport = useMemo(() => cleanMarkdownForPlainText(report), [report]);
  const isShareSupported = typeof navigator.share === 'function';

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Pass the raw report; cleaning is handled inside generatePdf
      await generatePdf(report, topic);
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const togglePodcast = () => {
    setShowPodcast(prev => !prev);
  }

  const handleShare = async () => {
    if (!isShareSupported) return;

    try {
      await navigator.share({
        title: `Report: ${topic}`,
        text: plainTextReport,
      });
    } catch (error) {
      // The user might have cancelled the share action, which throws an error.
      // We don't need to show an error message in that case.
      console.log('Share action was cancelled or failed.', error);
    }
  };

  return (
    <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-teal-300">Risultati della Ricerca</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePodcast}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${showPodcast ? 'bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
          >
            <PodcastIcon className="w-5 h-5" />
            <span>{showPodcast ? 'Chiudi Podcast' : 'Ascolta Podcast'}</span>
          </button>
          
          {isShareSupported && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              title="Condividi il testo del report"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Condividi</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:bg-green-800 disabled:cursor-wait"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {showPodcast && <PodcastPlayer text={plainTextReport} />}

      <article className="prose prose-invert prose-lg max-w-none prose-headings:text-teal-300 prose-a:text-blue-400 prose-strong:text-gray-200 mt-4">
        <Markdown>{report}</Markdown>
      </article>

      {sources.length > 0 && (
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-300">
            <SourceIcon className="w-6 h-6" />
            Fonti Utilizzate
          </h3>
          <ul className="mt-4 space-y-2 list-none p-0">
            {sources.map((source, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-teal-400 mt-1">●</span>
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 break-all"
                  title={source.web.uri}
                >
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportDisplay;