import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { QrCode, Copy, Check, Download } from 'lucide-react';

const DriverPaymentCard = ({ driver = {
  id: 'DRV001',
  name: 'Rajesh Kumar',
  phone: '+91-9876543210',
  gpayUPI: 'rajesh.kumar@okhdfcbank',
  rating: 4.8,
  ridesCompleted: 1240
} }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef();

  const generateGPayQR = (upi) => {
    // UPI deeplink format for Google Pay
    return `upi://pay?pa=${upi}&pn=${encodeURIComponent(driver.name)}&tn=TapNGo%20Ride%20Payment`;
  };

  const downloadQR = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${driver.name}-gpay-qr.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(driver.gpayUPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md">
      {/* Main Card Container */}
      <div className="relative">
        {/* Glassmorphic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-3xl blur-xl" />

        {/* Card Content */}
        <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-2xl">

          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">{driver.name}</h3>
              <p className="text-cyan-400 text-sm font-medium">Auto Driver • TapNGo Partner</p>
            </div>
            <div className="bg-orange-500/20 border border-orange-500/40 rounded-full p-3">
              <QrCode className="w-6 h-6 text-orange-400" />
            </div>
          </div>

          {/* Driver Stats Bar */}
          <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-cyan-500/20">
            <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
              <p className="text-xs text-cyan-400/70 uppercase tracking-wide">Rating</p>
              <p className="text-lg font-bold text-white mt-1">{driver.rating} ⭐</p>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
              <p className="text-xs text-orange-400/70 uppercase tracking-wide">Rides</p>
              <p className="text-lg font-bold text-white mt-1">{driver.ridesCompleted}</p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center mb-6">
            <p className="text-cyan-400 text-sm font-semibold mb-3">Scan to Pay via GPay</p>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <QRCode
                ref={qrRef}
                value={generateGPayQR(driver.gpayUPI)}
                size={200}
                level="H"
                includeMargin={true}
                renderAs="canvas"
              />
            </div>
            <button
              onClick={downloadQR}
              className="mt-3 flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Download className="w-3 h-3" />
              Download QR Code
            </button>
            <p className="text-xs text-gray-400 mt-2">Or use UPI ID below</p>
          </div>

          {/* UPI ID Copy Section */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-4">
            <p className="text-xs text-orange-400/70 uppercase tracking-wide mb-2">Google Pay / UPI ID</p>
            <div className="flex items-center justify-between">
              <p className="text-white font-mono text-sm">{driver.gpayUPI}</p>
              <button
                onClick={copyUPI}
                className="ml-3 p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-orange-400" />
                )}
              </button>
            </div>
          </div>

          {/* Phone Contact */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-4">
            <p className="text-xs text-cyan-400/70 uppercase tracking-wide">Direct Contact</p>
            <a
              href={`tel:${driver.phone}`}
              className="text-white font-semibold mt-1 hover:text-cyan-300 transition-colors flex items-center"
            >
              {driver.phone}
            </a>
          </div>

          {/* Fallback Payment Methods Info */}
          <div className="bg-gradient-to-r from-cyan-500/5 to-orange-500/5 border border-dashed border-cyan-500/30 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Payment Methods</p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>✓ TapNGo NFC (Preferred)</li>
              <li>✓ Google Pay / UPI (Fallback)</li>
              <li>✓ Cash Payment (Direct)</li>
            </ul>
          </div>

          {/* Bottom Message */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Can't scan? Use UPI manually or pay cash directly
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-1 -left-1 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-1 -right-1 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default DriverPaymentCard;
