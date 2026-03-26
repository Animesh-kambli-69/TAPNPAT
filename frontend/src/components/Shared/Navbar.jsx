import { useAuth } from '../../hooks/useAuth';
import { LogOut, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getProfileRoute = () => {
    if (user?.role === 'driver') return '/driver/profile';
    if (user?.role === 'customer') return '/customer/profile';
    return '/';
  };

  return (
    <nav className="bg-cyber-navy-light border-b border-cyber-blue/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyber-orange">tapNGo</h1>
          <p className="text-cyber-gray-dark text-sm">{title}</p>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-cyber-gray-light font-semibold">{user?.name}</p>
            <p className="text-cyber-gray-dark text-sm capitalize">{user?.role}</p>
          </div>
          {user?.isVerified && (
            <button
              onClick={() => navigate(getProfileRoute())}
              className="bg-cyber-blue text-cyber-navy px-4 py-2 rounded-lg hover:bg-cyan-600 transition flex items-center gap-2"
            >
              <User size={18} />
              Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-cyber-orange text-cyber-navy px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-cyber-blue"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cyber-navy border-t border-cyber-blue/30 p-4">
          <div className="text-cyber-gray-light mb-4">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-cyber-gray-dark text-sm capitalize">{user?.role}</p>
          </div>
          {user?.isVerified && (
            <button
              onClick={() => {
                navigate(getProfileRoute());
                setMenuOpen(false);
              }}
              className="w-full bg-cyber-blue text-cyber-navy px-4 py-2 rounded-lg hover:bg-cyan-600 transition flex items-center justify-center gap-2 mb-2"
            >
              <User size={18} />
              Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-cyber-orange text-cyber-navy px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
