import { useState } from "react";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import * as api from "../api/client";

interface Props {
  seed: string;
  address: string;
}

export default function PaymentPage({ seed, address }: Props) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [issuer, setIssuer] = useState("");
  const [mode, setMode] = useState<"xrp" | "rlusd">("xrp");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  if (!seed) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Create a wallet first to send payments.</p>
      </div>
    );
  }

  async function handleSend() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      if (mode === "xrp") {
        const res = await api.sendXRP({ senderSeed: seed, destination, amount });
        setResult(res);
      } else {
        const res = await api.sendRLUSD({ senderSeed: seed, destination, amount, issuer });
        setResult(res);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Send Payment</h2>

      {error && <p className="text-red-400 bg-red-900/20 px-4 py-2 rounded">{error}</p>}

      <Card title="Payment Details">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("xrp")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === "xrp" ? "bg-xrpl-accent text-white" : "bg-gray-800 text-gray-400"
            }`}
          >
            XRP
          </button>
          <button
            onClick={() => setMode("rlusd")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === "rlusd" ? "bg-xrpl-accent text-white" : "bg-gray-800 text-gray-400"
            }`}
          >
            RLUSD
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider">From</label>
            <code className="block text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded mt-1 break-all">
              {address}
            </code>
          </div>

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
            <label className="text-gray-400 text-xs uppercase tracking-wider">
              Amount ({mode === "xrp" ? "XRP" : "RLUSD"})
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent"
            />
          </div>

          {mode === "rlusd" && (
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider">RLUSD Issuer</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="rIssuer..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent"
              />
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={loading || !destination || !amount}
            className="w-full bg-xrpl-accent hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : `Send ${mode.toUpperCase()}`}
          </button>
        </div>
      </Card>

      {/* Result */}
      {result && (
        <Card title="Transaction Result">
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
              <span className="text-white ml-2">{result.amount} {result.currency || "XRP"}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
