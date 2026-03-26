import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const DriverOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    phoneNumber: '',
    email: '',

    // Step 2: Vehicle Info
    vehicleType: 'auto', // auto, taxi, bike
    vehicleName: '',
    vehicleNumber: '',
    licenseNumber: '',

    // Step 3: Banking & UPI
    gpayUPI: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',

    // Step 4: Location & Address
    city: '',
    state: '',
    address: '',
    zipCode: '',

    // Step 5: Verification
    termsAccepted: false,
    dataPrivacyAccepted: false,
    phoneVerified: false,
    bankVerified: false,
  });

  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState({
    phone: false,
    bank: false,
  });

  // Validation functions
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
    if (!formData.vehicleName.trim()) newErrors.vehicleName = 'Vehicle name is required';
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.gpayUPI.match(/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/)) newErrors.gpayUPI = 'Valid UPI ID required (e.g., name@bank)';
    if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    if (!formData.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) newErrors.ifscCode = 'Valid IFSC code required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.zipCode.match(/^[0-9]{6}$/)) newErrors.zipCode = 'Valid 6-digit postal code required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    const newErrors = {};
    if (!verified.phone) newErrors.phone = 'Phone number verification required';
    if (!verified.bank) newErrors.bank = 'Bank account verification required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'Terms & Conditions must be accepted';
    if (!formData.dataPrivacyAccepted) newErrors.dataPrivacyAccepted = 'Privacy Policy must be accepted';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();
    else if (step === 4) isValid = validateStep4();
    else if (step === 5) isValid = validateStep5();

    if (isValid) {
      if (step < 5) setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep5()) {
      // Save to localStorage or send to backend
      const driverProfile = {
        ...formData,
        createdAt: new Date().toISOString(),
        profileComplete: true,
      };
      localStorage.setItem('driverProfile', JSON.stringify(driverProfile));
      navigate('/driver/dashboard');
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

  const simulateBankVerification = () => {
    // Simulate bank verification
    setVerified(prev => ({ ...prev, bank: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">TapNGo Driver Profile</h1>
          <p className="text-gray-400">Complete your profile to start earning</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4, 5].map(i => (
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
                  {i === 2 && 'Vehicle'}
                  {i === 3 && 'Banking'}
                  {i === 4 && 'Location'}
                  {i === 5 && 'Verify'}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-700 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 shadow-2xl">

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Phone className="text-cyan-400" /> Personal Information
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

          {/* Step 2: Vehicle Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="text-orange-400" /> Vehicle Information
              </h2>

              <div>
                <label className="block text-white font-semibold mb-2">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="auto">Auto Rickshaw</option>
                  <option value="taxi">Taxi</option>
                  <option value="bike">Bike/Two-wheeler</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Vehicle Name/Model</label>
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleInputChange}
                  placeholder="e.g., Bajaj Auto RE"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.vehicleName && <p className="text-red-400 text-sm mt-1">{errors.vehicleName}</p>}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Registration Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., KA04AB1234"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.vehicleNumber && <p className="text-red-400 text-sm mt-1">{errors.vehicleNumber}</p>}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Driver's License Number"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.licenseNumber && <p className="text-red-400 text-sm mt-1">{errors.licenseNumber}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Banking & UPI */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                💳 Banking & UPI Details
              </h2>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-4">
                <p className="text-emerald-300 text-sm">
                  ✓ Your banking information is encrypted and secure. We never share your details.
                </p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Google Pay / UPI ID</label>
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

              <div>
                <label className="block text-white font-semibold mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="As per bank records"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.accountHolderName && <p className="text-red-400 text-sm mt-1">{errors.accountHolderName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="e.g., HDFC Bank"
                    className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                  />
                  {errors.bankName && <p className="text-red-400 text-sm mt-1">{errors.bankName}</p>}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="e.g., HDFC0000001"
                    className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none uppercase"
                  />
                  {errors.ifscCode && <p className="text-red-400 text-sm mt-1">{errors.ifscCode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Your bank account number"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.accountNumber && <p className="text-red-400 text-sm mt-1">{errors.accountNumber}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Location & Address */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="text-orange-400" /> Location Details
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

              <div>
                <label className="block text-white font-semibold mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address, locality"
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="6-digit postal code"
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          )}

          {/* Step 5: Verification */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="text-emerald-400" /> Verify & Complete
              </h2>

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
                      <p className="font-semibold text-white">Phone Number Verification</p>
                      <p className="text-sm text-gray-400">+91 {formData.phoneNumber}</p>
                    </div>
                  </div>
                  {verified.phone && <CheckCircle2 className="text-emerald-400" size={24} />}
                </div>

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

              {/* Bank Verification */}
              <div className={`border rounded-lg p-4 transition-all ${
                verified.bank
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-800/50 border-cyan-500/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase size={20} className={verified.bank ? 'text-emerald-400' : 'text-cyan-400'} />
                    <div>
                      <p className="font-semibold text-white">Bank Account Verification</p>
                      <p className="text-sm text-gray-400">{formData.bankName} • ****{formData.accountNumber?.slice(-4)}</p>
                    </div>
                  </div>
                  {verified.bank && <CheckCircle2 className="text-emerald-400" size={24} />}
                </div>

                {!verified.bank && (
                  <button
                    onClick={simulateBankVerification}
                    className="w-full mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Verify Bank Account
                  </button>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-3 border-t border-slate-700 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-cyan-500/30 bg-slate-800 accent-cyan-500"
                  />
                  <span className="text-gray-300 text-sm">
                    I accept the <a href="#" className="text-cyan-400 hover:underline">Terms & Conditions</a> and <a href="#" className="text-cyan-400 hover:underline">Service Agreement</a>
                  </span>
                </label>
                {errors.termsAccepted && <p className="text-red-400 text-sm">{errors.termsAccepted}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="dataPrivacyAccepted"
                    checked={formData.dataPrivacyAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-cyan-500/30 bg-slate-800 accent-cyan-500"
                  />
                  <span className="text-gray-300 text-sm">
                    I accept the <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a> and understand how my data will be used
                  </span>
                </label>
                {errors.dataPrivacyAccepted && <p className="text-red-400 text-sm">{errors.dataPrivacyAccepted}</p>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-700">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-lg font-semibold transition-colors"
              >
                Back
              </button>
            )}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                Next: Step {step + 1}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                Complete Profile & Start
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          Your information is encrypted and secure. We use bank-level security.
        </div>
      </div>
    </div>
  );
};

export default DriverOnboarding;
