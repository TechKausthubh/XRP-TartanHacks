import { useState } from "react";
import Card from "../components/Card";
import InfoTooltip from "../components/InfoTooltip";
import * as api from "../api/client";

interface Props {
  address: string;
  seed: string;
  onWalletCreated: (address: string, seed: string) => void;
}

export default function WalletPage({ address, seed, onWalletCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [restoreSeed, setRestoreSeed] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError("");
    try {
      const wallet = await api.createWallet();
      onWalletCreated(wallet.address, wallet.secret);
      setBalance(wallet.balance);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    setLoading(true);
    setError("");
    try {
      const wallet = await api.restoreWallet(restoreSeed);
      onWalletCreated(wallet.address, restoreSeed);
      const bal = await api.getBalance(wallet.address);
      setBalance(bal.balanceXrp);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefreshBalance() {
    if (!address) return;
    try {
      const bal = await api.getBalance(address);
      setBalance(bal.balanceXrp);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        Wallet Management
        <InfoTooltip
          title="Wallet"
          content="A wallet holds your keys: address (rXXX...) receives XRP; the secret (seed) signs transactions. On testnet you can create funded wallets instantly. Never share your secret."
        />
      </h2>

      {error && <p className="text-red-400 bg-red-900/20 px-4 py-2 rounded">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Wallet */}
        <Card title="Create New Testnet Wallet">
          <p className="text-gray-400 text-sm mb-4">
            Generate a new funded wallet on XRPL Testnet. The faucet credits it with XRP so you can send and create escrows immediately.
          </p>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-xrpl-accent hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Generate Wallet"}
          </button>
        </Card>

        {/* Restore Wallet */}
        <Card title="Restore from Seed">
          <p className="text-gray-400 text-sm mb-4">
            Enter your secret seed to restore an existing wallet.
          </p>
          <input
            type="text"
            value={restoreSeed}
            onChange={(e) => setRestoreSeed(e.target.value)}
            placeholder="sEdV19BLCjTY..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mb-3 focus:outline-none focus:border-xrpl-accent"
          />
          <button
            onClick={handleRestore}
            disabled={loading || !restoreSeed}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            Restore Wallet
          </button>
        </Card>
      </div>

      {/* Wallet Info */}
      {address && (
        <Card title="Active Wallet">
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider">Address</label>
              <code className="block text-sm text-xrpl-light bg-gray-800 px-3 py-2 rounded mt-1 break-all">
                {address}
              </code>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider">Secret Seed</label>
              <code className="block text-sm text-yellow-400 bg-gray-800 px-3 py-2 rounded mt-1 break-all">
                {seed}
              </code>
              <p className="text-xs text-yellow-600 mt-1">Keep this secret! Never share in production.</p>
            </div>
            {balance !== null && (
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider">Balance</label>
                  <p className="text-2xl font-bold text-xrpl-accent">
                    {balance.toFixed(2)} <span className="text-sm text-gray-400">XRP</span>
                  </p>
                </div>
                <button
                  onClick={handleRefreshBalance}
                  className="text-sm text-xrpl-accent hover:underline mt-4"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
