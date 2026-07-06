import { Upload, Brain, Search, FileText, CheckCircle, ArrowRight, Play, Database, Award, TrendingUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

export function HowItWorks({ onNavigate }: HowItWorksProps) {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: t('how_it_works.steps.step_1_title', 'Upload Image'),
      description: t('how_it_works.steps.step_1_desc', 'Take a clear photo of the affected crop leaves using your camera or upload an existing image from your device.'),
      details: [
        t('how_it_works.steps.step_1_detail_1', 'Supports JPG, PNG formats'),
        t('how_it_works.steps.step_1_detail_2', 'Maximum file size: 10MB'),
        t('how_it_works.steps.step_1_detail_3', 'Best results with high-quality images'),
        t('how_it_works.steps.step_1_detail_4', 'Multiple angles recommended'),
      ],
      color: 'from-blue-500 to-cyan-600',
    },
    {
      number: 2,
      icon: Brain,
      title: t('how_it_works.steps.step_2_title', 'AI Analysis'),
      description: t('how_it_works.steps.step_2_desc', 'Our advanced deep learning model analyzes the image using computer vision to identify patterns and symptoms.'),
      details: [
        t('how_it_works.steps.step_2_detail_1', 'Processes image in 2-5 seconds'),
        t('how_it_works.steps.step_2_detail_2', 'Compares with 10,000+ disease samples'),
        t('how_it_works.steps.step_2_detail_3', 'Uses convolutional neural networks'),
        t('how_it_works.steps.step_2_detail_4', 'Multi-layer pattern recognition'),
      ],
      color: 'from-purple-500 to-pink-600',
    },
    {
      number: 3,
      icon: Search,
      title: t('how_it_works.steps.step_3_title', 'Disease Identification'),
      description: t('how_it_works.steps.step_3_desc', 'The AI identifies potential diseases with confidence scores and provides detailed information about the condition.'),
      details: [
        t('how_it_works.steps.step_3_detail_1', 'Detects 150+ crop diseases'),
        t('how_it_works.steps.step_3_detail_2', '95%+ accuracy rate'),
        t('how_it_works.steps.step_3_detail_3', 'Confidence score provided'),
        t('how_it_works.steps.step_3_detail_4', 'Severity level assessment'),
      ],
      color: 'from-orange-500 to-red-600',
    },
    {
      number: 4,
      icon: FileText,
      title: t('how_it_works.steps.step_4_title', 'Get Recommendations'),
      description: t('how_it_works.steps.step_4_desc', 'Receive comprehensive treatment plans including immediate actions, organic solutions, and preventive measures.'),
      details: [
        t('how_it_works.steps.step_4_detail_1', 'Immediate action steps'),
        t('how_it_works.steps.step_4_detail_2', 'Organic treatment options'),
        t('how_it_works.steps.step_4_detail_3', 'Chemical solutions (when needed)'),
        t('how_it_works.steps.step_4_detail_4', 'Prevention guidelines'),
      ],
      color: 'from-green-500 to-emerald-600',
    },
  ];

  const technology = [
    {
      icon: Database,
      title: t('how_it_works.tech.tech_1_title', 'Training Dataset'),
      description: t('how_it_works.tech.tech_1_desc', 'Trained on 50,000+ images of healthy and diseased crops from various regions and conditions.'),
    },
    {
      icon: Brain,
      title: t('how_it_works.tech.tech_2_title', 'Deep Learning Models'),
      description: t('how_it_works.tech.tech_2_desc', 'Uses state-of-the-art CNN (Convolutional Neural Networks) architecture optimized for plant pathology.'),
    },
    {
      icon: Award,
      title: t('how_it_works.tech.tech_3_title', 'Accuracy Metrics'),
      description: t('how_it_works.tech.tech_3_desc', '95%+ precision in disease detection, validated by agricultural experts and field testing.'),
    },
    {
      icon: TrendingUp,
      title: t('how_it_works.tech.tech_4_title', 'Continuous Learning'),
      description: t('how_it_works.tech.tech_4_desc', 'Model improves over time with new data, ensuring up-to-date disease identification.'),
    },
  ];

  const faqs = [
    {
      question: t('how_it_works.faqs.q1', 'How accurate is the AI detection?'),
      answer: t('how_it_works.faqs.a1', 'Our AI model achieves 95%+ accuracy in detecting crop diseases. The model has been trained on over 50,000 images and validated by agricultural experts. However, for critical decisions, we always recommend consulting with local agricultural extension officers.'),
    },
    {
      question: t('how_it_works.faqs.q2', 'What types of crops are supported?'),
      answer: t('how_it_works.faqs.a2', 'Currently, we support major crops including tomatoes, potatoes, rice, wheat, cotton, sugarcane, and various vegetables. We are continuously expanding our database to include more crop varieties.'),
    },
    {
      question: t('how_it_works.faqs.q3', 'How quickly do I get results?'),
      answer: t('how_it_works.faqs.a3', 'Image analysis typically takes 2-5 seconds. The complete process from upload to receiving treatment recommendations usually takes less than 30 seconds.'),
    },
    {
      question: t('how_it_works.faqs.q4', 'Can I use the app offline?'),
      answer: t('how_it_works.faqs.a4', 'Currently, an internet connection is required for image analysis as the AI processing happens on our servers. We are working on an offline mode for future releases.'),
    },
    {
      question: t('how_it_works.faqs.q5', 'Is the treatment advice safe to follow?'),
      answer: t('how_it_works.faqs.a5', 'Yes, all treatment recommendations are based on established agricultural practices and reviewed by experts. However, always follow local regulations for pesticide use and consult with agricultural experts for severe infestations.'),
    },
    {
      question: t('how_it_works.faqs.q6', 'How do I take the best photo for analysis?'),
      answer: t('how_it_works.faqs.a6', 'For best results: 1) Take photos in good natural light, 2) Focus on affected areas, 3) Avoid blurry images, 4) Include the full leaf, 5) Take multiple angles if possible.'),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6">{t('how_it_works.hero_title', 'How Our AI Works')}</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
            {t('how_it_works.hero_subtitle', 'Understanding the technology behind intelligent crop disease detection')}
          </p>
          <button
            onClick={() => onNavigate('detect')}
            className="px-8 py-4 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
          >
            {t('how_it_works.try_it_now', 'Try It Now')}
            <ArrowRight className="size-5" />
          </button>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">{t('how_it_works.process_title', 'Simple 4-Step Process')}</h2>
            <p className="text-xl text-gray-600">
              {t('how_it_works.process_subtitle', 'From image upload to actionable insights in seconds')}
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="size-8 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Step {step.number}</div>
                          <h3 className="text-gray-900">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-6">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="flex-1">
                    <div className={`w-64 h-64 mx-auto bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-2xl`}>
                      <div className="text-white text-8xl">{step.number}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-200 to-transparent" />
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">{t('how_it_works.tech_title', 'Our Technology')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('how_it_works.tech_subtitle', 'Powered by cutting-edge AI and machine learning algorithms')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {technology.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="size-7 text-green-600" />
                  </div>
                  <h3 className="text-gray-900 mb-2">{tech.title}</h3>
                  <p className="text-gray-600">{tech.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div>
              <div className="text-5xl mb-2">{t('how_it_works.stats.stat_1_val', '50K+')}</div>
              <div className="text-green-100">{t('how_it_works.stats.stat_1_label', 'Training Images')}</div>
            </div>
            <div>
              <div className="text-5xl mb-2">{t('how_it_works.stats.stat_2_val', '150+')}</div>
              <div className="text-green-100">{t('how_it_works.stats.stat_2_label', 'Diseases Detected')}</div>
            </div>
            <div>
              <div className="text-5xl mb-2">{t('how_it_works.stats.stat_3_val', '95%')}</div>
              <div className="text-green-100">{t('how_it_works.stats.stat_3_label', 'Accuracy Rate')}</div>
            </div>
            <div>
              <div className="text-5xl mb-2">{t('how_it_works.stats.stat_4_val', '<5s')}</div>
              <div className="text-green-100">{t('how_it_works.stats.stat_4_label', 'Analysis Time')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">{t('how_it_works.faq_title', 'Frequently Asked Questions')}</h2>
            <p className="text-xl text-gray-600">
              {t('how_it_works.faq_subtitle', 'Everything you need to know about our AI system')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`size-5 text-gray-600 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-gray-900 mb-4">{t('how_it_works.demo_title', 'See It In Action')}</h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('how_it_works.demo_subtitle', 'Watch how easy it is to detect crop diseases with AgriCare AI')}
            </p>
            <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-2xl">
              <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                <Play className="size-10 text-green-600 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-gray-900 mb-4">{t('how_it_works.cta_title', 'Ready to Get Started?')}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('how_it_works.cta_subtitle', 'Join thousands of farmers using AI to protect their crops and increase yields')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('detect')}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              {t('how_it_works.start_detection', 'Start Detection Now')}
              <ArrowRight className="size-5" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              {t('how_it_works.view_dashboard', 'View Dashboard')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChevronDown({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}