
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface AudioPlayerProps {
  src: string;
  fileName: string;
  onReset: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, fileName, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };
      
      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressChange = () => {
    if(audioRef.current && progressBarRef.current) {
        audioRef.current.currentTime = Number(progressBarRef.current.value);
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-cyan-400 mb-2">Processing Complete!</h2>
      <p className="text-slate-400 mb-6">Here is your new track without male vocals.</p>
      
      <div className="bg-slate-700/50 p-4 rounded-lg">
        <p className="font-medium text-slate-300 truncate mb-4">{fileName}</p>
        <audio ref={audioRef} src={src} preload="metadata" onEnded={() => setIsPlaying(false)}></audio>
        <div className="flex items-center space-x-4">
            <button onClick={togglePlayPause} className="p-2 text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400">
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <span className="text-xs text-slate-400 w-10">{formatTime(currentTime)}</span>
            <input 
              type="range" 
              ref={progressBarRef}
              value={currentTime}
              max={duration || 0}
              onChange={handleProgressChange}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <span className="text-xs text-slate-400 w-10">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4 mt-6">
        <button onClick={onReset} className="px-6 py-3 text-sm font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500">
          Start Over
        </button>
        <a
          href={src}
          download={fileName}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download
        </a>
      </div>
    </div>
  );
};

export default AudioPlayer;
