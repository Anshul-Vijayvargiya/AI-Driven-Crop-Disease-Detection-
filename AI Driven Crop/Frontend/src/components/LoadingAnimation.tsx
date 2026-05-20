import { Brain, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  isOpen: boolean;
}

export function LoadingAnimation({ isOpen }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    'Analyzing image...',
    'Detecting diseases...',
    'Processing results...',
    'Preparing recommendations...',
  ];

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setMessageIndex(0);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      const messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 1500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Animated Brain Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-full">
              <Brain className="size-12 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Loader2 className="size-5 text-green-600 animate-spin" />
            <p className="text-gray-900">{messages[messageIndex]}</p>
          </div>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Processing</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-400 text-center">
          Our AI is analyzing your crop image using advanced deep learning models
        </p>
      </div>
    </div>
  );
}
