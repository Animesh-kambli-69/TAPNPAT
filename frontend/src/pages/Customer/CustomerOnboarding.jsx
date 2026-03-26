import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Wallet, CheckCircle2 } from 'lucide-react';

const CustomerOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    state: '',
    defaultPaymentMethod: 'gpay',
    gpayUPI: '',
    termsAccepted: false,
  });

  const [verified, setVerified] = useState({
    phone: false,
  });

  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.match(/^[0-9]{10}$/)) newErrors.phoneNumber = 'Valid 10-digit phone number required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (formData.defaultPaymentMethod === 'gpay' && !formData.gpayUPI.match(/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/)) {
      newErrors.gpayUPI = 'Valid UPI ID required';
    }
    if (!verified.phone) newErrors.phone = 'Phone verification required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'Terms must be accepted';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();

    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep3()) {
      const customerProfile = {
        ...formData,
        createdAt: new Date().toISOString(),
        profileComplete: true,
      };
      localStorage.setItem('customerProfile', JSON.stringify(customerProfile));

      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        navigate('/customer/dashboard', { replace: true });
      }, 300);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const simulatePhoneVerification = () => {
    if (otp === '123456') {
      setVerified(prev => ({ ...prev, phone: true }));
      setShowPhoneOTP(false);
      setOtp('');
    } else {
      setErrors(prev => ({ ...prev, otp: 'Incorrect OTP. Try 123456' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to TapNGo</h1>
          <p className="text-gray-400">Set up your account in 3 steps</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                    i <= step
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-gray-400'
                  }`}
                >
                  {i < step ? <CheckCircle2 size={24} /> : i}
                </div>
                <span className={`text-xs text-center ${i <= step ? 'text-cyan-400' : 'text-gray-500'}`}>
                  {i === 1 && 'Personal'}
                  {i === 2 && 'Location'}
                  {i === 3 && 'Payment'}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-700 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 shadow-2xl">

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Phone className="text-cyan-400" /> Your Information
              </h2>

              <div>
                <label className="block text-white font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="text-orange-400" /> Location
              </h2>

              <div>
                <label className="block text-white font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Bangalore"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g., Karnataka"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Payment Setup */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Wallet className="text-emerald-400" /> Payment Setup
              </h2>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
                <p className="text-cyan-300 text-sm">
                  Add a payment method to start using TapNGo for rides and purchases.
                </p>
              </div>

              {/* Phone Verification */}
              <div className={`border rounded-lg p-4 transition-all ${
                verified.phone
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-800/50 border-cyan-500/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Phone size={20} className={verified.phone ? 'text-emerald-400' : 'text-cyan-400'} />
                    <div>
                      <p className="font-semibold text-white">Verify Phone Number <span className="text-red-400">*</span></p>
                      <p className="text-sm text-gray-400">+91 {formData.phoneNumber || 'XXXXXXXXXX'}</p>
                    </div>
                  </div>
                  {verified.phone && <CheckCircle2 className="text-emerald-400" size={24} />}
                </div>

                {!verified.phone && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded p-3 mb-3">
                    <p className="text-orange-300 text-xs font-semibold">⚠️ This step is required to proceed</p>
                  </div>
                )}

                {!verified.phone && (
                  <>
                    {!showPhoneOTP ? (
                      <button
                        onClick={() => setShowPhoneOTP(true)}
                        className="w-full mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <div className="space-y-2 mt-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP (try 123456)"
                          className="w-full px-4 py-2 bg-slate-900 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none text-center tracking-wider"
                        />
                        {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}
                        <button
                          onClick={simulatePhoneVerification}
                          className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                        >
                          Verify OTP
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Payment Method */}
              {verified.phone && (
                <div className="space-y-3 border-t border-slate-700 pt-4">
                  <label className="block text-white font-semibold mb-3">Preferred Payment Method</label>

                  <label className="flex items-center gap-3 p-3 border border-cyan-500/20 rounded-lg cursor-pointer hover:bg-cyan-500/5 transition-colors">
                    <input
                      type="radio"
                      name="defaultPaymentMethod"
                      value="gpay"
                      checked={formData.defaultPaymentMethod === 'gpay'}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-cyan-500"
                    />
                    <div>
                      <p className="font-semibold text-white">Google Pay / UPI</p>
                      <p className="text-sm text-gray-400">Fast & secure</p>
                    </div>
                  </label>

                  {formData.defaultPaymentMethod === 'gpay' && (
                    <div className="mt-3 pl-7">
                      <input
                        type="text"
                        name="gpayUPI"
                        value={formData.gpayUPI}
                        onChange={handleInputChange}
                        placeholder="name@bankname"
                        className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                      />
                      {errors.gpayUPI && <p className="text-red-400 text-sm mt-1">{errors.gpayUPI}</p>}
                    </div>
                  )}

                  <label className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors opacity-50">
                    <input
                      type="radio"
                      name="defaultPaymentMethod"
                      value="wallet"
                      disabled
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-white">Wallet Balance</p>
                      <p className="text-sm text-gray-400">Coming soon</p>
                    </div>
                  </label>
                </div>
              )}

              {/* Terms */}
              {verified.phone && (
                <div className="border-t border-slate-700 pt-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 rounded border-cyan-500/30 bg-slate-800 accent-cyan-500"
                    />
                    <span className="text-gray-300 text-sm">
                      I accept the <a href="#" className="text-cyan-400 hover:underline">Terms & Conditions</a> and <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.termsAccepted && <p className="text-red-400 text-sm">{errors.termsAccepted}</p>}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {step < 3 ? (
            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-700">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                Next
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-slate-700 space-y-3">
              {!verified.phone && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-300 text-sm">
                  ❌ Complete phone verification to continue
                </div>
              )}
              {!formData.termsAccepted && verified.phone && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-300 text-sm">
                  ❌ Accept terms & conditions to continue
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!verified.phone || !formData.termsAccepted}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={20} />
                  Complete & Start
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          🔒 Your data is encrypted with bank-level security
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboarding;
