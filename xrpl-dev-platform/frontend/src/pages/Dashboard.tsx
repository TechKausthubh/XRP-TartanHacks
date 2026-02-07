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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to XRPL Dev Platform</h2>
          <p className="text-gray-400">Create or restore a wallet to get started.</p>
          <p className="text-gray-500 text-sm mt-4">Navigate to Wallet in the sidebar.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="text-gray-400">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-400">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Developer Dashboard</h2>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Balance">
          <p className="text-3xl font-bold text-xrpl-accent">
            {accountInfo?.balance?.toFixed(2)} <span className="text-lg text-gray-400">XRP</span>
          </p>
        </Card>
        <Card title="Account Sequence">
          <p className="text-3xl font-bold text-white">{accountInfo?.sequence}</p>
        </Card>
        <Card title="Active Escrows">
          <p className="text-3xl font-bold text-white">{escrows.length}</p>
        </Card>
      </div>

      {/* Address */}
      <Card title="Account Address">
        <code className="text-sm text-xrpl-light bg-gray-800 px-3 py-2 rounded block break-all">
          {address}
        </code>
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
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((tx: any, i: number) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2">{tx.type}</td>
                    <td className="py-2 font-mono text-xs">{tx.from?.slice(0, 16)}...</td>
                    <td className="py-2 font-mono text-xs">{tx.to ? `${tx.to.slice(0, 16)}...` : "—"}</td>
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
