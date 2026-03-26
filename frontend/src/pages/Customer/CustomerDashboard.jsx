import { useState, useEffect } from 'react';
import Navbar from '../../components/Shared/Navbar';
import StatCard from '../../components/Shared/StatCard';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { customerService } from '../../services/customerService';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, Users, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await customerService.getWallet();
      setWallet(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-cyber-navy">
      <Navbar title="Wallet & Transactions" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-cyber-orange to-orange-600 rounded-lg p-8 mb-8 text-cyber-navy">
          <p className="text-sm font-semibold opacity-90 mb-2">Available Balance</p>
          <h2 className="text-4xl font-bold mb-6">{formatCurrency(wallet?.balance || 0)}</h2>
          <div className="flex gap-4">
            <Link
              to="/customer/wallet"
              className="bg-cyber-navy text-cyber-orange px-6 py-2 rounded-lg font-semibold hover:bg-cyber-navy-light transition"
            >
              Top Up
            </Link>
            <Link
              to="/customer/transactions"
              className="border-2 border-cyber-navy text-cyber-navy px-6 py-2 rounded-lg font-semibold hover:bg-cyber-navy/20 transition"
            >
              History
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={Wallet}
            label="Total Credit"
            value={formatCurrency(wallet?.totalCredit || 0)}
            color="blue"
          />
          <StatCard
            icon={TrendingDown}
            label="Total Spent"
            value={formatCurrency(wallet?.totalDebit || 0)}
            color="orange"
          />
          <StatCard
            icon={Users}
            label="Account Status"
            value={wallet?.isBlocked ? 'Blocked' : 'Active'}
            color="green"
          />
        </div>
      </main>
    </div>
  );
}
