import { useEffect, useState } from "react";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import * as api from "../api/client";

interface Props {
  address: string;
}

export default function Dashboard({ address }: Props) {
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError("");
    Promise.all([
      api.getAccountInfo(address),
      api.getTransactions(address),
      api.listEscrows(address),
    ])
      .then(([info, txs, esc]) => {
        setAccountInfo(info);
        setTransactions(txs);
        setEscrows(esc);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-xrpl-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-xrpl-accent font-bold">X</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to XRPL Dev Platform</h2>
          <p className="text-gray-400 mb-6">Your one-stop toolkit for building on the XRP Ledger. Create wallets, send payments, and manage escrows with simple one-line SDK calls.</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Quick Start</p>
            <code className="text-sm text-xrpl-light">
              Navigate to <span className="text-xrpl-accent">Wallet</span> in the sidebar to begin.
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <span className="animate-spin h-5 w-5 border-2 border-xrpl-accent border-t-transparent rounded-full"></span>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Developer Dashboard</h2>
        <span className="text-xs bg-green-900/30 text-green-400 border border-green-800 px-3 py-1 rounded-full">
          Testnet Connected
        </span>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-xrpl-blue/30 to-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Balance</p>
          <p className="text-3xl font-bold text-xrpl-accent">
            {accountInfo?.balance?.toFixed(2)} <span className="text-lg text-gray-400">XRP</span>
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/20 to-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Account Sequence</p>
          <p className="text-3xl font-bold text-white">{accountInfo?.sequence}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-900/20 to-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Active Escrows</p>
          <p className="text-3xl font-bold text-white">{escrows.length}</p>
        </div>
      </div>

      {/* Wallet Info Card */}
      <Card title="Wallet Info">
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider">Address</label>
            <code className="block text-sm text-xrpl-light bg-gray-800 px-3 py-2 rounded mt-1 break-all">
              {address}
            </code>
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider">Network</label>
            <p className="text-sm text-white mt-1">XRPL Testnet (wss://s.altnet.rippletest.net:51233)</p>
          </div>
        </div>
      </Card>

      {/* Escrows */}
      {escrows.length > 0 && (
        <Card title="Escrows">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-2">Destination</th>
                  <th className="text-left py-2">Amount (XRP)</th>
                  <th className="text-left py-2">Finish After</th>
                </tr>
              </thead>
              <tbody>
                {escrows.map((e: any, i: number) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 font-mono text-xs">{e.destination?.slice(0, 20)}...</td>
                    <td className="py-2">{e.amount}</td>
                    <td className="py-2 text-xs">{e.finishAfter ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">From</th>
                  <th className="text-left py-2">To</th>
                  <th className="text-left py-2">Hash</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((tx: any, i: number) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-2">
                      <span className="bg-xrpl-blue/20 text-xrpl-light text-xs px-2 py-1 rounded">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-2 font-mono text-xs">{tx.from?.slice(0, 16)}...</td>
                    <td className="py-2 font-mono text-xs">{tx.to ? `${tx.to.slice(0, 16)}...` : "\u2014"}</td>
                    <td className="py-2">
                      {tx.hash ? (
                        <a
                          href={`https://testnet.xrpl.org/transactions/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-xrpl-accent hover:underline font-mono"
                        >
                          {tx.hash.slice(0, 12)}...
                        </a>
                      ) : (
                        <span className="text-gray-600 text-xs">{"\u2014"}</span>
                      )}
                    </td>
                    <td className="py-2">
                      <StatusBadge status={tx.status || "unknown"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
