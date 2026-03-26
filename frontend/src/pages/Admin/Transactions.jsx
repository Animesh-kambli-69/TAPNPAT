import { useState, useEffect } from 'react';
import Navbar from '../../components/Shared/Navbar';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTransactions({
        page,
        limit: 15,
        status: filters.status || undefined,
        type: filters.type || undefined,
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-cyber-navy">
      <Navbar title="Transaction Audit Log" />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setPage(1);
            }}
            className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg py-2 px-4 text-cyber-gray-light text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value });
              setPage(1);
            }}
            className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg py-2 px-4 text-cyber-gray-light text-sm"
          >
            <option value="">All Types</option>
            <option value="payment">Payment</option>
            <option value="topup">Top Up</option>
            <option value="refund">Refund</option>
          </select>
        </div>

        {/* Transactions Table */}
        <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyber-navy border-b border-cyber-blue/30">
                <tr>
                  <th className="text-left p-4 text-cyber-gray-light font-semibold">User</th>
                  <th className="text-left p-4 text-cyber-gray-light font-semibold">Amount</th>
                  <th className="text-left p-4 text-cyber-gray-light font-semibold">Type</th>
                  <th className="text-left p-4 text-cyber-gray-light font-semibold">Status</th>
                  <th className="text-left p-4 text-cyber-gray-light font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-cyber-blue/20 hover:bg-cyber-navy/50 transition">
                      <td className="p-4 text-cyber-gray-light font-semibold">{tx.userId?.name}</td>
                      <td className="p-4 text-cyber-orange font-bold">{formatCurrency(tx.amount)}</td>
                      <td className="p-4">
                        <span className="capitalize text-sm text-cyber-gray-light">{tx.type}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`capitalize text-sm font-semibold px-3 py-1 rounded ${
                            tx.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : tx.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-cyber-gray-dark text-sm">{formatDate(tx.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-cyber-gray-dark">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
