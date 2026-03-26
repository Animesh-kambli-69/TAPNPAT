import { useEffect, useState } from 'react';
import Navbar from '../../components/Shared/Navbar';
import StatCard from '../../components/Shared/StatCard';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { driverService } from '../../services/driverService';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, Users, TrendingUp, Star, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function DriverDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await driverService.getDashboard();
      setStats(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-cyber-navy">
      <Navbar title="Driver Dashboard" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            label="Today's Earnings"
            value={formatCurrency(stats?.todayEarnings || 0)}
            color="orange"
          />
          <StatCard
            icon={Users}
            label="Today's Rides"
            value={stats?.todayRides || 0}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Rides"
            value={stats?.totalRides || 0}
            color="green"
          />
          <StatCard
            icon={Star}
            label="Rating"
            value={`${stats?.rating || 5}/5`}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/driver/earnings"
            className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 hover:border-cyber-blue transition backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyber-orange/20 rounded-lg">
                <DollarSign className="text-cyber-orange" size={24} />
              </div>
              <div>
                <p className="text-cyber-gray-dark text-sm">View Earnings</p>
                <p className="text-cyber-gray-light font-semibold">Detailed Report</p>
              </div>
            </div>
          </Link>

          <Link
            to="/driver/rides"
            className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 hover:border-cyber-blue transition backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyber-blue/20 rounded-lg">
                <Users className="text-cyber-blue" size={24} />
              </div>
              <div>
                <p className="text-cyber-gray-dark text-sm">View Rides</p>
                <p className="text-cyber-gray-light font-semibold">Ride History</p>
              </div>
            </div>
          </Link>

          <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Calendar className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-cyber-gray-dark text-sm">This Month</p>
                <p className="text-cyber-gray-light font-semibold">{stats?.todayRides || 0} rides</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Rides */}
        <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-cyber-gray-light mb-6">Recent Rides</h2>
          <div className="space-y-3">
            {stats?.recentRides && stats.recentRides.length > 0 ? (
              stats.recentRides.map((ride) => (
                <div key={ride._id} className="flex justify-between items-center p-4 bg-cyber-navy rounded-lg border border-cyber-blue/20">
                  <div>
                    <p className="text-cyber-gray-light font-semibold">{ride.passengerId?.name}</p>
                    <p className="text-cyber-gray-dark text-sm">{ride.startLocation} → {ride.endLocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyber-orange font-bold">{formatCurrency(ride.calculatedFare)}</p>
                    <p className="text-cyber-gray-dark text-sm capitalize">{ride.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-cyber-gray-dark text-center py-8">No rides yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
