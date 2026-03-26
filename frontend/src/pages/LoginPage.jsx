import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, AlertCircle, Truck, ShoppingCart } from 'lucide-react';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null); // null = role selection, 'driver'/'customer' = login/signup
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    password: '',
    role: 'customer',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await login(formData.email, formData.password);
        if (!response.user.isVerified) {
          // Redirect to onboarding for unverified users
          const route = response.user.role === 'driver' ? '/driver/onboarding' : '/customer/onboarding';
          navigate(route);
        } else {
          // Redirect to dashboard for verified users
          const route = response.user.role === 'driver' ? '/driver/dashboard' : response.user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard';
          navigate(route);
        }
      } else {
        await register(formData);
        const response = await login(formData.email, formData.password);
        const route = response.user.role === 'driver' ? '/driver/onboarding' : '/customer/onboarding';
        navigate(route);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-8 backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cyber-orange mb-2">tapNGo</h1>
            <p className="text-cyber-gray-light text-sm">Merchant & Customer Dashboard</p>
          </div>

          {/* Role Selection Screen */}
          {!selectedRole ? (
            <div className="space-y-4">
              <p className="text-cyber-gray-light text-center mb-6 font-semibold">Choose your role to continue</p>

              {/* Driver Button */}
              <button
                onClick={() => {
                  setSelectedRole('driver');
                  setIsLogin(true);
                  setError('');
                  setFormData({ email: '', phone: '', name: '', password: '', role: 'driver' });
                }}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white py-4 rounded-lg font-bold transition flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
              >
                <Truck size={28} />
                I'm a Driver
              </button>

              {/* Customer Button */}
              <button
                onClick={() => {
                  setSelectedRole('customer');
                  setIsLogin(true);
                  setError('');
                  setFormData({ email: '', phone: '', name: '', password: '', role: 'customer' });
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-4 rounded-lg font-bold transition flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
              >
                <ShoppingCart size={28} />
                I'm a Customer
              </button>

              <p className="text-cyber-gray-dark text-xs text-center mt-6">
                Admin and Merchant accounts require registration from administrators
              </p>
            </div>
          ) : (
            <>
              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole(null);
                  setError('');
                  setFormData({ email: '', phone: '', name: '', password: '', role: 'customer' });
                  setIsLogin(true);
                }}
                className="mb-6 px-3 py-2 text-cyber-blue hover:text-cyber-gray-light hover:bg-cyber-navy/50 text-sm font-semibold flex items-center gap-1 transition rounded"
              >
                ← Back to Role Selection
              </button>

              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setFormData({ ...formData, email: '', phone: '', name: '', password: '' });
                  }}
                  className={`flex-1 py-2 rounded font-semibold transition ${
                    isLogin ? 'bg-cyber-orange text-cyber-navy' : 'bg-cyber-navy-light text-cyber-gray-light border border-cyber-blue/30'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setFormData({ ...formData, email: '', phone: '', name: '', password: '' });
                  }}
                  className={`flex-1 py-2 rounded font-semibold transition ${
                    !isLogin ? 'bg-cyber-orange text-cyber-navy' : 'bg-cyber-navy-light text-cyber-gray-light border border-cyber-blue/30'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Role Badge */}
              <div className="mb-6 p-3 bg-cyber-navy border border-cyan-500/30 rounded-lg text-center">
                <p className="text-cyber-gray-dark text-xs">Signing in as</p>
                <p className="text-cyber-blue font-bold text-lg capitalize">
                  {selectedRole === 'driver' ? '🚗 Driver' : '👤 Customer'}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 flex gap-2">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-3 text-cyber-blue" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full bg-cyber-navy border border-cyber-blue/30 rounded-lg py-3 pl-10 pr-4 text-cyber-gray-light placeholder-cyber-gray-dark focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue"
                      />
                    </div>
                    <div className="relative">
                      <Phone size={20} className="absolute left-3 top-3 text-cyber-blue" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full bg-cyber-navy border border-cyber-blue/30 rounded-lg py-3 pl-10 pr-4 text-cyber-gray-light placeholder-cyber-gray-dark focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue"
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-3 text-cyber-blue" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-cyber-navy border border-cyber-blue/30 rounded-lg py-3 pl-10 pr-4 text-cyber-gray-light placeholder-cyber-gray-dark focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue"
                  />
                </div>

                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-3 text-cyber-blue" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-cyber-navy border border-cyber-blue/30 rounded-lg py-3 pl-10 pr-4 text-cyber-gray-light placeholder-cyber-gray-dark focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-cyber-orange text-cyber-navy py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition mt-6"
                >
                  {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-cyber-navy border border-cyber-blue/20 rounded-lg">
                <p className="text-cyber-blue text-sm font-semibold mb-2">✅ Verified Accounts (Skip Onboarding):</p>
                <div className="text-cyber-gray-light text-xs space-y-1 mb-4">
                  {selectedRole === 'driver' && <p><strong>Driver:</strong> driver@tapngo.com / password123</p>}
                  {selectedRole === 'customer' && <p><strong>Customer:</strong> customer@tapngo.com / password123</p>}
                </div>

                <p className="text-orange-400 text-sm font-semibold mb-2">⏳ Unverified Accounts (Require Onboarding):</p>
                <div className="text-cyber-gray-light text-xs space-y-1">
                  {selectedRole === 'driver' && <p><strong>Driver:</strong> unverified.driver@tapngo.com / password123</p>}
                  {selectedRole === 'customer' && <p><strong>Customer:</strong> unverified.customer@tapngo.com / password123</p>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Phone({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <polyline points="22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></polyline>
    </svg>
  );
}
