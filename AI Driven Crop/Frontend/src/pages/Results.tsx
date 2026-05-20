import { useState } from 'react';
import { Download, Share2, AlertTriangle, ChevronDown, ChevronUp, Scan, Leaf, Beaker, Shield } from 'lucide-react';
import type { DetectionResult } from '../App';
import { TreatmentModal } from '../components/TreatmentModal';

interface ResultsProps {
  result: DetectionResult | null;
  onNavigate: (page: string) => void;
}

export function Results({ result, onNavigate }: ResultsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No detection results available</p>
          <button
            onClick={() => onNavigate('detect')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start New Detection
          </button>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'High':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const treatmentSections = [
    { id: 'immediate', label: 'Immediate Actions', icon: AlertTriangle, items: result.treatments.immediate },
    { id: 'organic', label: 'Organic Solutions', icon: Leaf, items: result.treatments.organic },
    { id: 'chemical', label: 'Chemical Solutions', icon: Beaker, items: result.treatments.chemical },
    { id: 'preventive', label: 'Preventive Measures', icon: Shield, items: result.treatments.preventive },
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-green-50 to-white">
      <TreatmentModal
        isOpen={showTreatmentModal}
        onClose={() => setShowTreatmentModal(false)}
        disease={{
          name: result.diseaseName,
          scientificName: 'Phytophthora infestans',
          description: result.description,
          symptoms: result.symptoms,
          image: result.image,
          treatments: result.treatments,
        }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-4">Detection Results</h1>
            <p className="text-xl text-gray-600">
              Analysis complete - Review the diagnosis and recommended treatments
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Preview */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={result.image}
                  alt="Analyzed crop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Detection Info */}
            <div className="space-y-6">
              {/* Disease Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-gray-900 mb-2">{result.diseaseName}</h2>
                    <p className="text-gray-600">Detected in {result.cropType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getSeverityColor(result.severity)}`}>
                    {result.severity} Severity
                  </span>
                </div>

                {/* Confidence Score */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Confidence Score</span>
                    <span className="text-green-600">{result.confidence}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4">{result.description}</p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowTreatmentModal(true)}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Full Details
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="size-5" />
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="size-5" />
                  </button>
                </div>
              </div>

              {/* Symptoms */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-gray-900 mb-4">Common Symptoms</h3>
                <ul className="space-y-2">
                  {result.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Treatment Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-gray-900 mb-6">Treatment Recommendations</h2>
            <div className="space-y-4">
              {treatmentSections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSection === section.id;

                return (
                  <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg border border-gray-200">
                          <Icon className="size-5 text-green-600" />
                        </div>
                        <span className="text-gray-900">{section.label}</span>
                        <span className="text-sm text-gray-500">({section.items.length} steps)</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="size-5 text-gray-600" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-6 py-4 bg-white">
                        <ol className="space-y-3">
                          {section.items.map((item, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 flex-1">{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('detect')}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Scan className="size-5" />
              Analyze Another Image
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
