import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export function Footer({ onNavigate, currentPage }: FooterProps) {
  // Hide footer on login page
  if (currentPage === 'login') {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-green-900 to-green-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <Leaf className="size-5 text-green-600" />
              </div>
              <span className="text-white">AgriCare AI</span>
            </div>
            <p className="text-green-100 text-sm mb-4">
              AI-powered crop disease detection and agricultural intelligence platform helping farmers protect their crops and increase yields.
            </p>
            <div className="flex gap-3">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="size-4" />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Twitter className="size-4" />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Linkedin className="size-4" />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="size-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('landing')} className="text-green-100 hover:text-white transition-colors text-sm">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="text-green-100 hover:text-white transition-colors text-sm">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="text-green-100 hover:text-white transition-colors text-sm">
                  How it Works
                </button>
              </li>
              <li>
                <button className="text-green-100 hover:text-white transition-colors text-sm">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-green-100 hover:text-white transition-colors text-sm">
                  Blog
                </button>
              </li>
              <li>
                <button className="text-green-100 hover:text-white transition-colors text-sm">
                  FAQs
                </button>
              </li>
              <li>
                <button className="text-green-100 hover:text-white transition-colors text-sm">
                  Support
                </button>
              </li>
              <li>
                <button className="text-green-100 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-green-100 text-sm">
                <Mail className="size-4 mt-0.5 flex-shrink-0" />
                <span>support@agricareai.com</span>
              </li>
              <li className="flex items-start gap-2 text-green-100 text-sm">
                <Phone className="size-4 mt-0.5 flex-shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-green-100 text-sm">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>123 Agriculture Hub, New Delhi, India</span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-green-100 mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-green-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="px-4 py-2 bg-white text-green-900 rounded-lg hover:bg-green-50 transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-green-100 text-sm">
            © 2025 AgriCare AI. All rights reserved. Made with 🌱 for farmers.
          </p>
        </div>
      </div>
    </footer>
  );
}