import React, { useState, useEffect, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import AudioPlayer from './components/AudioPlayer';
import { MusicIcon } from './components/icons/MusicIcon';

const PROCESSING_STEPS = [
  "Initializing audio engine...",
  "Analyzing vocal frequencies (0%)...",
  "Identifying male vocal stems (25%)...",
  "Reconstructing instrumental tracks (50%)...",
  "Isolating backing vocals (75%)...",
  "Finalizing new version (100%)...",
];

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // FIX: Corrected timer ID type for browser environment. `NodeJS.Timeout` is not available.
    let interval: ReturnType<typeof setInterval>;
    if (isProcessing) {
      setProcessingStep(PROCESSING_STEPS[0]);
      let stepIndex = 1;
      interval = setInterval(() => {
        if (stepIndex < PROCESSING_STEPS.length) {
          setProcessingStep(PROCESSING_STEPS[stepIndex]);
          stepIndex++;
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);
  
  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please upload a valid audio file.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setProcessedUrl(null);
  };
  
  const handleProcess = useCallback(() => {
    if (!file) return;

    setIsProcessing(true);
    
    // Simulate Gemini API processing
    // In a real application, this is where you would call the Gemini API
    // or another backend service to process the audio file.
    // For this demo, we'll simulate a delay and then use the original file.
    setTimeout(() => {
        const url = URL.createObjectURL(file);
        setProcessedUrl(url);
        setIsProcessing(false);
    }, PROCESSING_STEPS.length * 1500);

  }, [file]);

  const handleReset = () => {
    if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
    }
    setFile(null);
    setIsProcessing(false);
    setProcessedUrl(null);
    setError(null);
    setProcessingStep('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            Male Parts Remover
          </h1>
          <p className="text-slate-300 mt-4 text-lg px-2">
            Tired of the male parts ruining a perfectly good song? You’ll love this service.
          </p>
          <p className="text-slate-400 mt-2 text-lg">
            Upload any music track to remove the male vocals using AI.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-xl shadow-2xl shadow-slate-900/50 p-6 md:p-8 backdrop-blur-sm border border-slate-700">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          
          {isProcessing ? (
            <Loader message={processingStep} />
          ) : processedUrl ? (
            <AudioPlayer src={processedUrl} fileName={file?.name || 'processed_track.mp3'} onReset={handleReset} />
          ) : !file ? (
            <FileUpload onFileSelect={handleFileSelect} />
          ) : (
            <div className="text-center">
              <div className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-center space-x-3 mb-6">
                <MusicIcon className="w-6 h-6 text-cyan-400" />
                <span className="font-medium text-slate-300 truncate">{file.name}</span>
              </div>
              <div className="flex justify-center items-center space-x-4">
                <button onClick={handleReset} className="px-6 py-3 text-sm font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500">
                    Change File
                </button>
                <button
                    onClick={handleProcess}
                    className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400"
                >
                    Process Track
                </button>
              </div>
            </div>
          )}
        </main>
        
        <footer className="text-center mt-8">
            <p className="text-slate-500 text-sm">
                Powered by a simulated AI model. For demonstration purposes only.
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;