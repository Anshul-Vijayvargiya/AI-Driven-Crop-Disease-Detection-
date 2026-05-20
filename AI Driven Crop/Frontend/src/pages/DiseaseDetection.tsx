import { useState, useCallback } from 'react';
import { Upload, Camera, AlertCircle, X, CheckCircle, Leaf } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [crop, setCrop] = useState(""); // ✅ optional crop name

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
            <h1 className="text-gray-900 mb-4">Detect Crop Diseases</h1>
            <p className="text-xl text-gray-600">
              Upload a clear photo of your crop leaves for instant AI-powered disease detection
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
                      <span>Image uploaded successfully</span>
                    </div>
                  </div>
                )}

                {/* Upload Zone */}
                {!selectedImage && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-8 border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <Camera className="size-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-900 mb-2">Drag and drop your image here</p>
                    <p className="text-gray-500 mb-4">or</p>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors">
                      <Upload className="size-5" />
                      Browse Files
                      <input id="file-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                    <p className="text-sm text-gray-400 mt-4">Supports: JPG, PNG, JPEG (Max 10MB)</p>
                  </div>
                )}

                {/* Crop name input */}
                {selectedImage && (
                  <input
                    type="text"
                    placeholder="Enter crop name (optional)"
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
                    Analyze Image
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
                    <h3 className="text-gray-900 mb-2">For Best Results</h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Take photos in natural daylight",
                    "Focus on affected leaf areas",
                    "Ensure image is clear and not blurry",
                    "Include full leaf in frame",
                    "Avoid shadows and reflections",
                    "Take multiple angles if needed",
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