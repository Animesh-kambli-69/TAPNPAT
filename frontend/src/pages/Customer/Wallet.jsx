import { useState } from 'react';
import Navbar from '../../components/Shared/Navbar';
import { customerService } from '../../services/customerService';
import { formatCurrency } from '../../utils/formatters';
import { Plus } from 'lucide-react';

export default function CustomerWallet() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTopup = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      await customerService.topupWallet(parseFloat(amount));
      setMessage('Top-up successful!');
      setAmount('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Top-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-navy">
      <Navbar title="Top Up Wallet" />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-cyber-navy-light border border-cyber-blue/30 rounded-lg p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-cyber-gray-light mb-8 flex items-center gap-2">
            <Plus size={28} className="text-cyber-orange" />
            Add Money to Wallet
          </h2>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.includes('success')
                  ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                  : 'bg-red-900/20 text-red-300 border border-red-500/50'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleTopup} className="space-y-6">
            <div>
              <label className="block text-cyber-gray-light font-semibold mb-3">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="w-full bg-cyber-navy border border-cyber-blue/30 rounded-lg py-4 px-4 text-cyber-gray-light placeholder-cyber-gray-dark focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue text-lg"
              />
            </div>

            <div className="bg-cyber-navy border border-cyber-blue/20 rounded-lg p-4">
              <p className="text-cyber-gray-dark text-sm mb-2">Amount to be added:</p>
              <p className="text-3xl font-bold text-cyber-orange">{formatCurrency(parseFloat(amount) || 0)}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyber-orange text-cyber-navy py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Top Up Wallet'}
            </button>
          </form>

          {/* Quick Amount Buttons */}
          <div className="mt-8">
            <p className="text-cyber-gray-light font-semibold mb-4">Quick amounts:</p>
            <div className="grid grid-cols-2 gap-4">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="bg-cyber-navy border border-cyber-blue/30 text-cyber-gray-light py-3 rounded-lg hover:border-cyber-blue transition font-semibold"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
