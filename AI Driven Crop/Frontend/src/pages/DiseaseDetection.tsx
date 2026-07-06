import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Camera, AlertCircle, X, CheckCircle, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { ErrorState } from '../components/ErrorStates';
import type { DetectionResult } from '../App';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import apiClient from "../services/apiClient"; // ✅ connect to backend

interface DiseaseDetectionProps {
  onDetectionComplete: (result: DetectionResult) => void;
  onNavigate: (page: string) => void;
}

export function DiseaseDetection({ onDetectionComplete, onNavigate }: DiseaseDetectionProps) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [crop, setCrop] = useState(""); // ✅ optional crop name
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Drag/drop handlers...
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Real backend call
  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], "upload.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("image", file);
      if (crop.trim()) formData.append("crop", crop.trim());

      const res = await apiClient.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const prediction = res.data.prediction;
      const result: DetectionResult = {
        diseaseName: prediction.disease,
        confidence: Math.round(prediction.confidence * 100),
        severity: prediction.confidence > 0.9 ? "High" : "Medium",
        cropType: prediction.crop,
        image: selectedImage,
        description: `Detected ${prediction.disease} in ${prediction.crop}.`,
        symptoms: prediction.common_symptoms,
        treatments: {
          immediate: prediction.immediate_action,
          organic: prediction.organic_solution,
          chemical: prediction.chemical_solution,
          preventive: prediction.preventive_measures,
        },
      };

      onDetectionComplete(result);
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Please check backend logs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleImages = [
    { type: 'good', title: 'Good Photo', tips: ['Clear focus', 'Good lighting', 'Close-up view'] },
    { type: 'bad', title: 'Avoid This', tips: ['Blurry', 'Too far', 'Poor lighting'] },
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-green-50 to-white">
      <LoadingAnimation isOpen={isAnalyzing} />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-4">{t('disease_detection.title')}</h1>
            <p className="text-xl text-gray-600">
              {t('disease_detection.subtitle')}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {!selectedImage ? (
                  <ErrorState type="no-image" onUpload={() => document.getElementById('file-input')?.click()} />
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img src={selectedImage} alt="Selected crop" className="w-full h-full object-contain" />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>{t('disease_detection.upload_success')}</span>
                    </div>
                  </div>
                )}

                {/* Camera Zone */}
                {showCamera && !selectedImage && (
                  <div className="mt-8 bg-black rounded-xl overflow-hidden relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-h-[500px] object-contain" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 flex justify-center gap-4">
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        {t('disease_detection.take_photo')}
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        {t('disease_detection.cancel')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Zone */}
                {!selectedImage && !showCamera && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-8 border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <Camera className="size-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-900 mb-2">{t('disease_detection.drag_drop')}</p>
                    <p className="text-gray-500 mb-4">{t('disease_detection.or')}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <label className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors shadow-sm w-full sm:w-auto">
                        <Upload className="size-5" />
                        {t('disease_detection.upload_image')}
                        <input id="file-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                      </label>

                      <button
                        onClick={startCamera}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
                      >
                        <Camera className="size-5" />
                        {t('disease_detection.capture_image')}
                      </button>
                    </div>

                    <p className="text-sm text-gray-400 mt-6">{t('disease_detection.supports')}</p>
                  </div>
                )}

                {/* Crop name input */}
                {selectedImage && (
                  <input
                    type="text"
                    placeholder={t('disease_detection.enter_crop_name')}
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="mt-4 w-full border rounded-lg p-2"
                  />
                )}

                {/* Analyze Button */}
                {selectedImage && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full mt-6 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Leaf className="size-5" />
                    {t('disease_detection.analyze_image')}
                  </button>
                )}
              </div>
            </div>
                         {/* Tips Sidebar */}
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">{t('disease_detection.best_results')}</h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    t('disease_detection.tips.tip_1'),
                    t('disease_detection.tips.tip_2'),
                    t('disease_detection.tips.tip_3'),
                    t('disease_detection.tips.tip_4'),
                    t('disease_detection.tips.tip_5'),
                    t('disease_detection.tips.tip_6'),
                  ].map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-green-600 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* closes bg-white card */}
            </div>
            {/* closes sidebar */}
          </div>
          {/* closes grid */}
        </div>
        {/* closes container */}
      </div>
      {/* closes page */}
    </div>
  );
}