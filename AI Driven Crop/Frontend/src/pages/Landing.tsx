import { Scan, Droplets, TrendingUp, Brain, ArrowRight, CheckCircle, Users, Award, Target, Sparkles, Shield, Zap, Globe, Play } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface LandingProps {
  onNavigate: (page: string) => void;
}

export function Landing({ onNavigate }: LandingProps) {
  const features = [
    {
      icon: Scan,
      title: 'AI Disease Detection',
      description: 'Upload crop images and get instant disease diagnosis with 95%+ accuracy using advanced deep learning',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Brain,
      title: 'Smart Treatment Plans',
      description: 'Receive personalized treatment recommendations including organic, chemical, and preventive solutions',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Droplets,
      title: 'Weather Intelligence',
      description: 'Real-time weather forecasts with crop-specific farming advice and severe weather alerts',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: TrendingUp,
      title: 'Live Market Rates',
      description: 'Access real-time Mandi prices across India with price trends to maximize your profits',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const benefits = [
    { icon: Zap, title: 'Lightning Fast', description: 'Results in under 5 seconds' },
    { icon: Shield, title: 'Expert Validated', description: 'Verified by agricultural experts' },
    { icon: Globe, title: '24/7 Available', description: 'Access anytime, anywhere' },
    { icon: Sparkles, title: 'Always Learning', description: 'AI improves continuously' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Punjab',
      text: 'AgriCare AI helped me detect late blight early and save my entire tomato crop. The treatment suggestions were spot on!',
      rating: 5,
    },
    {
      name: 'Sunita Devi',
      location: 'Maharashtra',
      text: 'Easy to use and very accurate. The weather alerts help me plan my farming activities better.',
      rating: 5,
    },
    {
      name: 'Arjun Patel',
      location: 'Gujarat',
      text: 'The market price feature is amazing! I can now sell my produce at the right time for better prices.',
      rating: 5,
    },
  ];

  const stats = [
    { label: 'Diseases Detected', value: '150+', icon: Target },
    { label: 'Accuracy Rate', value: '95%', icon: Award },
    { label: 'Farmers Helped', value: '50K+', icon: Users },
    { label: 'Crops Saved', value: '100K+', icon: Sparkles },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-emerald-600">
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NjMyMDk0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Agriculture"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Animated circles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white mb-6">
              <Sparkles className="size-4" />
              <span className="text-sm">AI-Powered Agricultural Intelligence</span>
            </div>

            <h1 className="text-white mb-6 text-5xl md:text-6xl lg:text-7xl">
              Protect Your Crops with{' '}
              <span className="bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
                AI Technology
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-50 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload a photo, get instant disease diagnosis, and receive expert treatment recommendations. 
              Join 50,000+ farmers using cutting-edge AI to save their harvests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => onNavigate('detect')}
                className="group px-8 py-5 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 text-lg"
              >
                <Scan className="size-6" />
                Start Free Detection
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="group px-8 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all flex items-center gap-3 text-lg"
              >
                <Play className="size-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-green-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-300" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-300" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="size-8 mx-auto mb-3 text-green-600" />
                  <div className="text-4xl text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-b from-white via-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 mb-4">
              <Sparkles className="size-4" />
              <span className="text-sm">Powerful Features</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-4xl md:text-5xl">Everything You Need in One Platform</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive agricultural intelligence powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="size-8 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-3 text-2xl">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1635705582652-576cca028848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGhlYWx0aHxlbnwxfHx8fDE3NjMyMDk0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Plant health"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl shadow-2xl">
                  <div className="text-5xl mb-2">95%</div>
                  <div className="text-green-100">Accuracy Rate</div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-gray-900 mb-6 text-4xl">Why Choose AgriCare AI?</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Built by farmers, for farmers. Our AI technology brings enterprise-grade crop disease detection to your fingertips.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Icon className="size-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4 text-4xl">Trusted by Farmers Across India</h2>
            <p className="text-xl text-gray-600">
              See what farmers are saying about AgriCare AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-green-100"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                {/* Text */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4 text-4xl">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600">It's as easy as 1-2-3</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Upload Photo',
                description: 'Take a clear photo of the affected crop leaves',
                icon: Scan,
                color: 'from-blue-500 to-cyan-600',
              },
              {
                step: '2',
                title: 'AI Analysis',
                description: 'Our AI analyzes the image in under 5 seconds',
                icon: Brain,
                color: 'from-purple-500 to-pink-600',
              },
              {
                step: '3',
                title: 'Get Treatment',
                description: 'Receive detailed treatment recommendations',
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-600',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative text-center group">
                  <div className={`w-24 h-24 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                    <Icon className="size-12 text-white" />
                  </div>
                  <div className="absolute top-10 -right-8 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl text-green-600 hidden md:block">
                    {item.step}
                  </div>
                  <h3 className="text-gray-900 mb-3 text-2xl">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-1 bg-gradient-to-r from-green-300 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('how-it-works')}
              className="text-green-600 hover:text-green-700 flex items-center gap-2 mx-auto text-lg"
            >
              Learn more about our technology
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6 text-4xl md:text-5xl">Ready to Protect Your Crops?</h2>
            <p className="text-2xl text-green-100 mb-10">
              Join 50,000+ farmers using AI to detect diseases early and save their harvests
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('detect')}
                className="px-10 py-5 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3 text-lg"
              >
                <Scan className="size-6" />
                Start Detection Now
                <ArrowRight className="size-5" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-10 py-5 bg-green-800/50 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-green-800/70 transition-all flex items-center justify-center gap-3 text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
