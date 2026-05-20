import { X, Download, Share2, AlertCircle, Leaf, Beaker, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  disease: {
    name: string;
    scientificName: string;
    description: string;
    symptoms: string[];
    image: string;
    treatments: {
      immediate: string[];
      organic: string[];
      chemical: string[];
      preventive: string[];
    };
  };
}

export function TreatmentModal({ isOpen, onClose, disease }: TreatmentModalProps) {
  const [activeTab, setActiveTab] = useState<'immediate' | 'organic' | 'chemical' | 'prevention'>('immediate');

  if (!isOpen) return null;

  const tabs = [
    { id: 'immediate', label: 'Immediate Actions', icon: AlertCircle },
    { id: 'organic', label: 'Organic Solutions', icon: Leaf },
    { id: 'chemical', label: 'Chemical Solutions', icon: Beaker },
    { id: 'prevention', label: 'Prevention', icon: Shield },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-br from-green-600 to-green-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="size-5 text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-white mb-1">{disease.name}</h2>
            <p className="text-green-100 text-sm italic">{disease.scientificName}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Disease Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="mb-4">
              <h3 className="text-gray-900 mb-2">About this Disease</h3>
              <p className="text-gray-600">{disease.description}</p>
            </div>

            {/* Symptoms */}
            <div>
              <h4 className="text-gray-900 mb-3">Common Symptoms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {disease.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Treatment Tabs */}
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {disease.treatments[activeTab].map((treatment, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{treatment}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety Notice */}
            {activeTab === 'chemical' && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-900 mb-1">Safety Precautions</p>
                    <p className="text-sm text-amber-700">
                      Always wear protective equipment when handling chemicals. Follow manufacturer instructions and local regulations. Consult with agricultural experts before application.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="size-4" />
              Download PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="size-4" />
              Share
            </button>
            <button className="flex-1 md:flex-none px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Consult Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
