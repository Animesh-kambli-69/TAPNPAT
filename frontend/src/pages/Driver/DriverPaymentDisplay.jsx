import React from 'react';
import DriverPaymentCard from '../../components/Driver/DriverPaymentCard';

const DriverPaymentDisplay = () => {
  // Sample driver data
  const currentDriver = {
    id: 'DRV001',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    gpayUPI: 'rajesh.kumar@okhdfcbank',
    rating: 4.8,
    ridesCompleted: 1240
  };

  // Multiple driver examples
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
    },
    {
      id: 'DRV003',
      name: 'Vikram Singh',
      phone: '+91-9998765432',
      gpayUPI: 'vikram.singh@airtel',
      rating: 4.7,
      ridesCompleted: 2100
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Driver Payment Cards</h1>
        <p className="text-gray-400">Fallback payment method showcase - GPay QR Scanner for customers</p>
      </div>

      {/* Main Driver Card Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Your Payment Card</h2>
        <div className="flex justify-center">
          <DriverPaymentCard driver={currentDriver} />
        </div>
      </div>

      {/* Multi-Driver Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Other Drivers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {driverExamples.slice(1).map((driver) => (
            <div key={driver.id} className="flex justify-center">
              <DriverPaymentCard driver={driver} />
            </div>
          ))}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-16 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 border border-cyan-500/30 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-4">How it Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div>
              <h4 className="text-white font-semibold">Customer Scans QR</h4>
              <p className="text-gray-400 text-sm mt-1">Customer scans the GPay QR code on driver's card</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-400 font-bold">2</span>
            </div>
            <div>
              <h4 className="text-white font-semibold">Opens GPay App</h4>
              <p className="text-gray-400 text-sm mt-1">Automatically opens Google Pay with driver's UPI ID</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center">
              <span className="text-cyan-400 font-bold">3</span>
            </div>
            <div>
              <h4 className="text-white font-semibold">Payment Complete</h4>
              <p className="text-gray-400 text-sm mt-1">Customer pays fare amount & ride is completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl p-6">
          <h4 className="text-white font-bold mb-3">✨ Key Features</h4>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>✓ Dynamic QR code generation</li>
            <li>✓ UPI deeplink integration</li>
            <li>✓ One-tap payment</li>
            <li>✓ Fallback payment method</li>
            <li>✓ Driver rating & reviews</li>
            <li>✓ Download QR for printing</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-6">
          <h4 className="text-white font-bold mb-3">🎯 Benefits</h4>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>✓ No internet required for QR</li>
            <li>✓ Works with all UPI apps</li>
            <li>✓ Instant payment confirmation</li>
            <li>✓ Better than cash handling</li>
            <li>✓ Transaction history in GPay</li>
            <li>✓ Reduces fraud & disputes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DriverPaymentDisplay;
