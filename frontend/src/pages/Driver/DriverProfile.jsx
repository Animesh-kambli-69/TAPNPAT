import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import { User, Mail, Phone, Briefcase, MapPin, Wallet, Check, X } from 'lucide-react';

export default function DriverProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [driverProfile, setDriverProfile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    vehicleType: '',
    vehicleName: '',
    vehicleNumber: '',
    licenseNumber: '',
    gpayUPI: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    city: '',
    state: '',
    address: '',
    zipCode: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profile = JSON.parse(localStorage.getItem('driverProfile') || '{}');

    setUserInfo(user);
    setDriverProfile(profile);

    setFormData({
      fullName: profile?.fullName || user?.name || '',
      email: profile?.email || user?.email || '',
      phoneNumber: profile?.phoneNumber || user?.phone || '',
      vehicleType: profile?.vehicleType || '',
      vehicleName: profile?.vehicleName || '',
      vehicleNumber: profile?.vehicleNumber || '',
      licenseNumber: profile?.licenseNumber || '',
      gpayUPI: profile?.gpayUPI || '',
      accountHolderName: profile?.accountHolderName || '',
      bankName: profile?.bankName || '',
      accountNumber: profile?.accountNumber || '',
      ifscCode: profile?.ifscCode || '',
      city: profile?.city || '',
      state: profile?.state || '',
      address: profile?.address || '',
      zipCode: profile?.zipCode || '',
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedProfile = {
        ...driverProfile,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('driverProfile', JSON.stringify(updatedProfile));

      setDriverProfile(updatedProfile);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-navy">
      <Navbar title="Driver Profile" />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.includes('successfully')
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}>
            {message.includes('successfully') ? (
              <Check size={20} />
            ) : (
              <X size={20} />
            )}
            {message}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-orange-500 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{formData.fullName || 'Driver Name'}</h2>
                <p className="text-cyber-gray-light">🚗 Verified Driver</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-cyber-orange hover:bg-orange-600 text-cyber-navy font-semibold rounded-lg transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Personal Information */}
          <section className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User size={24} className="text-cyber-blue" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </section>

          {/* Vehicle Information */}
          <section className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase size={24} className="text-cyber-orange" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                >
                  <option value="">Select vehicle type</option>
                  <option value="auto">Auto</option>
                  <option value="taxi">Taxi</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Vehicle Name</label>
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </section>

          {/* Banking & UPI */}
          <section className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Wallet size={24} className="text-cyber-blue" />
              Banking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">UPI ID</label>
                <input
                  type="text"
                  name="gpayUPI"
                  value={formData.gpayUPI}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-cyber-gray-light text-sm mb-2">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </section>

          {/* Location & Address */}
          <section className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin size={24} className="text-cyber-orange" />
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-cyber-gray-light text-sm mb-2">Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-cyber-gray-light text-sm mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg bg-cyber-navy border border-cyber-blue/30 text-white ${
                    isEditing ? 'focus:border-cyber-blue focus:outline-none' : 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
