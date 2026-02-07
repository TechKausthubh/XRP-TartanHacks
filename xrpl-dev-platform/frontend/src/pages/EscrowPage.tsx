import { useState, useEffect } from "react";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import * as api from "../api/client";

interface Props {
  seed: string;
  address: string;
}

export default function EscrowPage({ seed, address }: Props) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [finishMinutes, setFinishMinutes] = useState("5");
  const [cancelMinutes, setCancelMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [escrows, setEscrows] = useState<any[]>([]);

  useEffect(() => {
    if (address) {
      api.listEscrows(address).then(setEscrows).catch(() => {});
    }
  }, [address]);

  if (!seed) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Create a wallet first to manage escrows.</p>
      </div>
    );
  }

  async function handleCreate() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.createEscrow({
        senderSeed: seed,
        destination,
        amount,
        finishAfterMinutes: Number(finishMinutes),
        cancelAfterMinutes: cancelMinutes ? Number(cancelMinutes) : undefined,
      });
      setResult(res);
      const esc = await api.listEscrows(address);
      setEscrows(esc);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Smart Escrow</h2>

      {error && <p className="text-red-400 bg-red-900/20 px-4 py-2 rounded">{error}</p>}

      {/* Create Escrow */}
      <Card title="Create Time-Based Escrow">
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider">Destination Address</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="rDestination..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider">Amount (XRP)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider">Release After (minutes)</label>
              <input
                type="number"
                value={finishMinutes}
                onChange={(e) => setFinishMinutes(e.target.value)}
                placeholder="5"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider">Cancel After (minutes, optional)</label>
              <input
                type="number"
                value={cancelMinutes}
                onChange={(e) => setCancelMinutes(e.target.value)}
                placeholder="60"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading || !destination || !amount || !finishMinutes}
            className="w-full bg-xrpl-accent hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Escrow..." : "Create Escrow"}
          </button>
        </div>
      </Card>

      {/* Result */}
      {result && (
        <Card title="Escrow Created">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Status:</span>
              <StatusBadge status={result.status} />
            </div>
            <div>
              <span className="text-gray-400">Hash:</span>
              <code className="block text-xs text-xrpl-light bg-gray-800 px-3 py-2 rounded mt-1 break-all">
                {result.hash}
              </code>
            </div>
            <div>
              <span className="text-gray-400">Amount:</span>
              <span className="text-white ml-2">{result.amount} XRP</span>
            </div>
            <div>
              <span className="text-gray-400">Releases after:</span>
              <span className="text-white ml-2">{result.finishAfter}</span>
            </div>
            <div>
              <span className="text-gray-400">Sequence:</span>
              <span className="text-white ml-2">{result.sequence}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Active Escrows */}
      <Card title="Active Escrows">
        {escrows.length === 0 ? (
          <p className="text-gray-500">No active escrows.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-2">Destination</th>
                  <th className="text-left py-2">Amount (XRP)</th>
                  <th className="text-left py-2">Releases After</th>
                  <th className="text-left py-2">Cancels After</th>
                </tr>
              </thead>
              <tbody>
                {escrows.map((e: any, i: number) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 font-mono text-xs">{e.destination?.slice(0, 20)}...</td>
                    <td className="py-2">{e.amount}</td>
                    <td className="py-2 text-xs">{e.finishAfter ?? "N/A"}</td>
                    <td className="py-2 text-xs">{e.cancelAfter ?? "N/A"}</td>
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
