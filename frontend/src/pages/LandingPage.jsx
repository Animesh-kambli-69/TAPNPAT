import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Zap, Shield, TrendingUp, Users, MapPin, QrCode, Smartphone, Menu, X, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Tap Payments',
      description: 'Pay with just a tap of your NFC card. No change needed, no disputes, instant settlement.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Bank-Level Security',
      description: 'Your data is encrypted with enterprise-grade security. 100% safe and secure transactions.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Earn More',
      description: 'Drivers earn better with digital payments. Track earnings in real-time, withdraw instantly.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'For Everyone',
      description: 'Works for auto drivers, taxis, retail shops, food courts. One app for all payments.'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Location-First',
      description: 'Find drivers nearby, see ratings, track earnings by area. All location-based insights.'
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: 'Fallback QR Codes',
      description: 'If NFC fails, scan the driver\'s QR code for instant Google Pay payment.'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Download & Sign Up',
      description: 'Create your account in 2 minutes. For drivers or customers.',
      icon: '📱'
    },
    {
      step: 2,
      title: 'Complete Your Profile',
      description: 'Add your details and verify your phone. Takes 5 minutes.',
      icon: '✓'
    },
    {
      step: 3,
      title: 'Get Your Card/NFC',
      description: 'Receive your NFC card or digital payment card. Start earning/paying.',
      icon: '💳'
    },
    {
      step: 4,
      title: 'Start Using',
      description: 'Tap to pay (driver) or tap to earn (passenger). Instant settlements!',
      icon: '⚡'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Drivers' },
    { number: '2M+', label: 'Monthly Transactions' },
    { number: '₹85Cr+', label: 'Payments Processed' },
    { number: '4.8★', label: 'Average Rating' }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Auto Driver',
      city: 'Bangalore',
      text: 'TapNGo changed my life! I earn 40% more with digital payments. No more change issues!'
    },
    {
      name: 'Priya Sharma',
      role: 'Passenger',
      city: 'Mumbai',
      text: 'Love the simplicity. Just tap and go. No waiting for change, no disputes. Perfect!'
    },
    {
      name: 'DMart Bangalore',
      role: 'Retail Manager',
      city: 'Bangalore',
      text: 'Our customers love TapNGo. Fast checkouts, instant settlement, zero fraud risk.'
    }
  ];

  const faqs = [
    {
      q: 'Is TapNGo safe?',
      a: 'Yes! We use bank-level encryption. Your data is protected with enterprise-grade security. All transactions are verified and secure.'
    },
    {
      q: 'How do I get started?',
      a: 'Download the app, sign up with phone number, complete your 5-minute profile setup, verify your phone, and you\'re ready to go!'
    },
    {
      q: 'What if NFC doesn\'t work?',
      a: 'No problem! Scan the driver\'s QR code to open Google Pay and pay via UPI. Works with all UPI apps.'
    },
    {
      q: 'How long does settlement take?',
      a: 'Money is settled to your UPI account within 4 hours. Most payments settle in 1-2 hours.'
    },
    {
      q: 'Can I use it offline?',
      a: 'NFC works without internet. Once you reconnect, your transaction syncs and settles automatically.'
    },
    {
      q: 'What cities does TapNGo support?',
      a: 'We\'re live in Bangalore, Mumbai, Delhi, Pune, Chennai, and expanding to 100+ cities. Check your area now!'
    }
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-orange-500 rounded-lg flex items-center justify-center font-bold">
                TN
              </div>
              <span className="text-xl font-bold">tapNGo</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
              <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="#features" className="block py-2 hover:text-cyan-400">Features</a>
              <a href="#how-it-works" className="block py-2 hover:text-cyan-400">How It Works</a>
              <a href="#faq" className="block py-2 hover:text-cyan-400">FAQ</a>
              <button
                onClick={() => navigate('/login')}
                className="w-full mt-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 bg-clip-text text-transparent">
              Welcome to tapNGo
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              The future of contactless payments for autorickshaw rides and retail
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Say goodbye to change issues. Tap once to pay. Instant settlement. Zero disputes. Available in 50+ cities across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 rounded-lg font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <button
                className="px-8 py-4 border-2 border-cyan-500/50 hover:border-cyan-400 rounded-lg font-bold text-lg transition-colors"
              >
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-t border-b border-cyan-500/20">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-cyan-400">{stat.number}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-500/20 to-orange-500/20 border border-cyan-500/30 rounded-2xl p-8 flex items-center justify-center min-h-96">
              <div className="text-center">
                <Smartphone className="w-24 h-24 mx-auto text-cyan-400 mb-4" />
                <p className="text-xl font-semibold">Download tapNGo App</p>
                <p className="text-gray-400 mt-2">Coming to iOS & Android</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="text-cyan-400" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Instant Settlements</p>
                  <p className="text-sm text-gray-400">Money in your account within 4 hours</p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="text-orange-400" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Bank-Level Security</p>
                  <p className="text-sm text-gray-400">Enterprise-grade encryption & protection</p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <QrCode className="text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="font-semibold">QR Code Fallback</p>
                  <p className="text-sm text-gray-400">Works with all UPI apps (GPay, PhonePe, Paytm)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need for seamless contactless payments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-cyan-500/20 rounded-xl p-8 hover:border-cyan-500/50 transition-all">
                <div className="text-cyan-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Get started in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-cyan-500/10 to-orange-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{item.step}</h3>
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>

                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="text-cyan-500" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Users Say</h2>
            <p className="text-gray-400 text-lg">Join thousands of happy drivers and customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-cyan-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-orange-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role} • {testimonial.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">Got questions? We have answers</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-cyan-500/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-cyan-500/5 transition-colors"
                >
                  <span className="font-semibold text-left">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${openFAQ === i ? 'rotate-180' : ''}`}
                  />
                </button>

                {openFAQ === i && (
                  <div className="px-6 pb-4 text-gray-300 border-t border-cyan-500/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-500/20 via-orange-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Payments?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of drivers and customers already using tapNGo. Earn more, pay smarter.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/50 border-t border-cyan-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  TN
                </div>
                <span className="font-bold">tapNGo</span>
              </div>
              <p className="text-gray-400 text-sm">The future of contactless payments.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400">Security</a></li>
                <li><a href="#" className="hover:text-cyan-400">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-400">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cyan-500/20 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 tapNGo. All rights reserved. | Made with ❤️ for India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
