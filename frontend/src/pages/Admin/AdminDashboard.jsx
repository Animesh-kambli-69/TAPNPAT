import { useState, useEffect } from 'react';
import Navbar from '../../components/Shared/Navbar';
import StatCard from '../../components/Shared/StatCard';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import { Users, Zap, Wallet, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#FF6B35', '#00D4FF', '#10B981', '#FCD34D'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const userChartData = dashboard?.users
    ? [
        { name: 'Drivers', value: dashboard.users.drivers },
        { name: 'Customers', value: dashboard.users.customers },
        { name: 'Merchants', value: dashboard.users.merchants },
      ]
    : [];

  return (
    <div className="min-h-screen bg-cyber-navy">
      <Navbar title="Admin Dashboard" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={dashboard?.users?.total || 0}
            color="orange"
          />
          <StatCard
            icon={Zap}
            label="Transactions"
            value={dashboard?.transactions?.total || 0}
            color="blue"
          />
          <StatCard
            icon={Wallet}
            label="Total Revenue"
            value={formatCurrency(dashboard?.revenue?.total || 0)}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Transaction"
            value={formatCurrency(dashboard?.revenue?.average || 0)}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/admin/users"
            className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 hover:border-cyber-blue transition backdrop-blur-md"
          >
            <h3 className="text-cyber-gray-light font-semibold mb-2">User Management</h3>
            <p className="text-cyber-gray-dark text-sm">{dashboard?.users?.total} total users</p>
          </Link>

          <Link
            to="/admin/transactions"
            className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 hover:border-cyber-blue transition backdrop-blur-md"
          >
            <h3 className="text-cyber-gray-light font-semibold mb-2">Transactions</h3>
            <p className="text-cyber-gray-dark text-sm">{dashboard?.transactions?.total} total</p>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Distribution */}
          <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 backdrop-blur-md">
            <h3 className="text-cyber-gray-light font-semibold mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userChartData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                  {userChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions */}
          <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 backdrop-blur-md">
            <h3 className="text-cyber-gray-light font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {dashboard?.recentTransactions && dashboard.recentTransactions.length > 0 ? (
                dashboard.recentTransactions.slice(0, 5).map((tx) => (
                  <div key={tx._id} className="flex justify-between items-center p-3 bg-cyber-navy rounded border border-cyber-blue/20">
                    <div className="flex-1">
                      <p className="text-cyber-gray-light text-sm font-semibold">{tx.userId?.name}</p>
                      <p className="text-cyber-gray-dark text-xs capitalize">{tx.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyber-orange font-bold text-sm">{formatCurrency(tx.amount)}</p>
                      <p className="text-cyber-gray-dark text-xs capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-cyber-gray-dark text-sm text-center py-4">No transactions</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
