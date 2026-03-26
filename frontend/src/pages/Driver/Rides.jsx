import { useState, useEffect } from 'react';
import Navbar from '../../components/Shared/Navbar';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { driverService } from '../../services/driverService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DriverRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRides();
  }, [page]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await driverService.getRides({ page, limit: 10 });
      setRides(response.data);
    } catch (error) {
      console.error('Failed to fetch rides:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-cyber-navy">
      <Navbar title="My Rides" />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-6 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-cyber-gray-light mb-6">Ride History</h2>
          <div className="space-y-4">
            {rides && rides.length > 0 ? (
              rides.map((ride) => (
                <div
                  key={ride._id}
                  className="flex justify-between items-center p-4 bg-cyber-navy rounded-lg border border-cyber-blue/20 hover:border-cyber-blue transition"
                >
                  <div className="flex-1">
                    <p className="text-cyber-gray-light font-semibold">{ride.passengerId?.name}</p>
                    <p className="text-cyber-gray-dark text-sm mb-2">
                      {ride.startLocation} → {ride.endLocation}
                    </p>
                    <p className="text-cyber-gray-dark text-xs">{formatDate(ride.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyber-orange font-bold">{formatCurrency(ride.calculatedFare)}</p>
                    <p className="text-cyber-gray-dark text-sm capitalize mt-1">{ride.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-cyber-gray-dark py-8">No rides found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
