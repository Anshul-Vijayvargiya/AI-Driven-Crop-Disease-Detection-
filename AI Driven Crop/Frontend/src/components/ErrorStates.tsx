import { ImageOff, AlertCircle, WifiOff, CheckCircle, Upload } from 'lucide-react';

interface ErrorStateProps {
  type: 'no-image' | 'analysis-error' | 'no-results' | 'network-error';
  onRetry?: () => void;
  onUpload?: () => void;
}

export function ErrorState({ type, onRetry, onUpload }: ErrorStateProps) {
  const states = {
    'no-image': {
      icon: <ImageOff className="size-16 text-gray-400" />,
      title: 'No image selected yet',
      description: 'Upload a clear photo of your crop leaves to get started with disease detection',
      action: onUpload ? (
        <button
          onClick={onUpload}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Upload className="size-5" />
          Upload Image
        </button>
      ) : null,
      tips: [
        'Take photos in good lighting',
        'Focus on affected leaves',
        'Avoid blurry images',
      ],
    },
    'analysis-error': {
      icon: <AlertCircle className="size-16 text-red-500" />,
      title: 'Unable to analyze image',
      description: 'We encountered an issue while analyzing your image. This could be due to:',
      action: onRetry ? (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      ) : null,
      tips: [
        'Image quality is too low',
        'Image doesn\'t contain plant leaves',
        'File format not supported',
        'Image size is too large',
      ],
    },
    'no-results': {
      icon: <CheckCircle className="size-16 text-green-500" />,
      title: 'No diseases detected',
      description: 'Great news! Your crop appears to be healthy. No signs of disease were found.',
      action: null,
      tips: [
        'Continue regular monitoring',
        'Maintain proper watering schedule',
        'Ensure adequate sunlight',
        'Practice crop rotation',
      ],
    },
    'network-error': {
      icon: <WifiOff className="size-16 text-orange-500" />,
      title: 'Connection lost',
      description: 'Unable to connect to the server. Please check your internet connection.',
      action: onRetry ? (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Retry Connection
        </button>
      ) : null,
      tips: [
        'Check your internet connection',
        'Try again in a few moments',
        'Contact support if issue persists',
      ],
    },
  };

  const state = states[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {state.icon}
        </div>

        {/* Title */}
        <h3 className="text-gray-900 mb-3">{state.title}</h3>

        {/* Description */}
        <p className="text-gray-600 mb-6">{state.description}</p>

        {/* Tips */}
        {state.tips && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">
              {type === 'no-results' ? 'Keep your crops healthy:' : 'Possible reasons:'}
            </p>
            <ul className="space-y-1">
              {state.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        {state.action && (
          <div className="flex justify-center">
            {state.action}
          </div>
        )}
      </div>
    </div>
  );
}
