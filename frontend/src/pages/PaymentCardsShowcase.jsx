import React from 'react';
import DriverPaymentCard from '../../components/Driver/DriverPaymentCard';
import MerchantPaymentCard from '../../components/Merchant/MerchantPaymentCard';

const PaymentCardsShowcase = () => {
  const driverExamples = [
    {
      id: 'DRV001',
      name: 'Rajesh Kumar',
      phone: '+91-9876543210',
      gpayUPI: 'rajesh.kumar@okhdfcbank',
      rating: 4.8,
      ridesCompleted: 1240
    },
    {
      id: 'DRV002',
      name: 'Priya Sharma',
      phone: '+91-9123456789',
      gpayUPI: 'priya.sharma@ibl',
      rating: 4.9,
      ridesCompleted: 856
    }
  ];

  const merchantExamples = [
    {
      id: 'MER001',
      name: 'DMart - Bangalore Main',
      category: 'Supermarket',
      phone: '+91-9090909090',
      gpayUPI: 'dmart.bangalore@okhdfcbank',
      location: 'MG Road, Bangalore',
      monthlyVolume: 45000,
      totalTransactions: 3420
    },
    {
      id: 'MER002',
      name: 'Inorbit Mall Food Court',
      category: 'Food & Beverage',
      phone: '+91-8765432109',
      gpayUPI: 'inorbit.foodcourt@ibl',
      location: 'Inorbit Mall, Bangalore',
      monthlyVolume: 28000,
      totalTransactions: 2100
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            TapNGo Payment Cards
          </h1>
          <p className="text-gray-400 text-lg">
            Fallback payment method with GPay QR Scanner integration
          </p>
        </div>
      </div>

      {/* Driver Cards Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-white mb-2">🚗 Auto Driver Cards</h2>
        <p className="text-gray-400 mb-8">For autorickshaw drivers to receive payments via Google Pay/UPI</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {driverExamples.map((driver) => (
            <div key={driver.id} className="flex justify-center lg:justify-start">
              <DriverPaymentCard driver={driver} />
            </div>
          ))}
        </div>
      </div>

      {/* Merchant Cards Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-white mb-2">🏪 Merchant/Retail Cards</h2>
        <p className="text-gray-400 mb-8">For DMart, Malls, and Food Courts to accept TapNGo payments</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {merchantExamples.map((merchant) => (
            <div key={merchant.id} className="flex justify-center lg:justify-start">
              <MerchantPaymentCard merchant={merchant} />
            </div>
          ))}
        </div>
      </div>

      {/* Information Sections */}
      <div className="max-w-7xl mx-auto space-y-8">

        {/* How It Works */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-orange-500/10 border border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">🎯 How Payment Cards Work</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-lg">1</div>
              <div>
                <h4 className="text-white font-semibold mb-2">Customer Scans QR</h4>
                <p className="text-gray-400 text-sm">Customer uses any smartphone to scan the QR code at driver's dashboard or merchant counter</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-lg">2</div>
              <div>
                <h4 className="text-white font-semibold mb-2">Opens Google Pay</h4>
                <p className="text-gray-400 text-sm">QR code contains UPI deeplink that automatically opens Google Pay app with pre-filled UPI ID</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg">3</div>
              <div>
                <h4 className="text-white font-semibold mb-2">Complete Payment</h4>
                <p className="text-gray-400 text-sm">Customer enters amount and confirms payment. Both parties receive instant confirmation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl p-8">
            <h4 className="text-white font-bold text-xl mb-4">✨ Card Features</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Dynamic QR code generation with UPI deeplinks</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>One-click UPI ID copy to clipboard</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Download QR code for printing or saving</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Display driver rating, contact, and stats</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Glassmorphic design with Cyber-Urban theme</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Mobile-responsive and touch-friendly</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-8">
            <h4 className="text-white font-bold text-xl mb-4">🎯 Benefits</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Works offline - no internet needed for QR display</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Compatible with all UPI apps (GPay, PhonePe, Paytm)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Instant payment confirmation with notification</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Better than cash - secure and traceable</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Automatic transaction history in customer's app</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Reduces fraud and payment disputes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">📋 Real-World Use Cases</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-cyan-300 font-semibold mb-3">🚗 For Auto Drivers</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Display card on dashboard for passenger to scan</li>
                <li>• Print QR code and laminate for durability</li>
                <li>• Share card photo in WhatsApp ride groups</li>
                <li>• Fallback when TapNGo NFC fails</li>
                <li>• No bank account number exposure</li>
              </ul>
            </div>

            <div>
              <h4 className="text-emerald-300 font-semibold mb-3">🏪 For Merchants</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Display at checkout counter for customers</li>
                <li>• Email/WhatsApp to regular customers</li>
                <li>• Include in receipt QR code</li>
                <li>• Works for both in-store and delivery orders</li>
                <li>• Instant settlement to UPI account</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">🔧 Technical Implementation</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-indigo-300 font-semibold mb-3">UPI Deeplink Format</h4>
              <code className="block bg-slate-900/50 border border-indigo-500/20 rounded p-3 text-cyan-300 overflow-auto">
                upi://pay?pa=UPI_ID&pn=NAME&tn=DESCRIPTION
              </code>
              <p className="text-gray-400 mt-2 text-xs">All major UPI apps recognize this format and auto-open.</p>
            </div>

            <div>
              <h4 className="text-indigo-300 font-semibold mb-3">QR Code Library</h4>
              <p className="text-gray-300">Built with <span className="text-cyan-400">qrcode.react</span> - generates high-quality QR codes with error correction level H (30% recovery).</p>
              <p className="text-gray-400 mt-2 text-xs">Supports download as PNG for printing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCardsShowcase;
