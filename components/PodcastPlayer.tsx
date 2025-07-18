
import React, { useState, useEffect, useCallback } from 'react';
import { PlayIcon, PauseIcon, StopIcon } from './Icons';

interface PodcastPlayerProps {
  text: string;
}

// A simple utility to chunk text into smaller pieces for better TTS performance
const chunkText = (text: string, chunkSize = 200): string[] => {
    const sentences = text.split(/(?<=[.?!])\s+/);
    const chunks: string[] = [];
    let currentChunk = '';
    for (const sentence of sentences) {
        if (currentChunk.length + sentence.length <= chunkSize) {
            currentChunk += sentence + ' ';
        } else {
            chunks.push(currentChunk.trim());
            currentChunk = sentence + ' ';
        }
    }
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
};


const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterances, setUtterances] = useState<SpeechSynthesisUtterance[]>([]);
  const [currentUtteranceIndex, setCurrentUtteranceIndex] = useState(0);

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };

    const chunks = chunkText(text);
    const utteranceObjects = chunks.map(chunk => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = 'it-IT';
      return utterance;
    });

    setUtterances(utteranceObjects);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.speechSynthesis.cancel();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [text]);


  const playNext = useCallback(() => {
    setCurrentUtteranceIndex(prev => {
        const nextIndex = prev + 1;
        if (utterances.length > 0 && nextIndex < utterances.length) {
            const nextUtterance = utterances[nextIndex];
            nextUtterance.onend = playNext;
            window.speechSynthesis.speak(nextUtterance);
            return nextIndex;
        } else {
            setIsSpeaking(false);
            setIsPaused(false);
            return 0; // Reset for next play
        }
    });
  }, [utterances]);


  const handlePlay = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.cancel();
      if (utterances.length > 0) {
          const firstUtterance = utterances[0];
          firstUtterance.onend = playNext;
          window.speechSynthesis.speak(firstUtterance);
          setCurrentUtteranceIndex(0);
      }
    }
    setIsSpeaking(true);
  }, [isPaused, utterances, playNext]);
  
  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentUtteranceIndex(0);
  };

  return (
    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 flex items-center justify-center gap-6 mb-4 animate-fade-in">
      {!isSpeaking || isPaused ? (
        <button onClick={handlePlay} className="text-teal-300 hover:text-teal-200 transition-colors" aria-label="Play">
          <PlayIcon className="w-10 h-10" />
        </button>
      ) : (
        <button onClick={handlePause} className="text-teal-300 hover:text-teal-200 transition-colors" aria-label="Pause">
          <PauseIcon className="w-10 h-10" />
        </button>
      )}
      <button onClick={handleStop} className="text-red-400 hover:text-red-300 transition-colors" aria-label="Stop" disabled={!isSpeaking}>
        <StopIcon className="w-10 h-10" />
      </button>
    </div>
  );
};

export default PodcastPlayer;
