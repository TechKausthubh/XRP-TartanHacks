import { useState } from "react";
import Card from "../components/Card";
import InfoTooltip from "../components/InfoTooltip";
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
  const [success, setSuccess] = useState("");

  if (!seed) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/60">Create a wallet first to send payments.</p>
      </div>
    );
  }

  async function handleSend() {
    setLoading(true);
    setError("");
    setSuccess("");
    setResult(null);
    try {
      if (mode === "xrp") {
        const res = await api.sendXRP({ senderSeed: seed, destination, amount });
        setResult(res);
      } else {
        const res = await api.sendRLUSD({ senderSeed: seed, destination, amount, issuer });
        setResult(res);
      }
      setSuccess("Payment sent successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        Send Payment
        <InfoTooltip
          title="Payment"
          content="A Payment transaction moves XRP (or issued currency like RLUSD) from one account to another. It is final once the ledger closes (~3–5 seconds)."
        />
      </h2>

      {error && (
        <div className="flex items-center gap-3 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
          <span className="text-red-500 text-lg">&#10007;</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded-lg">
          <span className="text-green-500 text-lg">&#10003;</span>
          <span>{success}</span>
        </div>
      )}

      <Card title="Payment Details">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("xrp")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === "xrp" ? "bg-xrpl-accent text-xrpl-dark" : "bg-white/[0.06] text-white/70 border border-white/[0.06]"
            }`}
          >
            XRP
          </button>
          <button
            onClick={() => setMode("rlusd")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === "rlusd" ? "bg-xrpl-accent text-xrpl-dark" : "bg-white/[0.06] text-white/70 border border-white/[0.06]"
            }`}
          >
            RLUSD
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider">From</label>
            <code className="block text-sm text-xrpl-light bg-white/[0.04] border border-white/[0.06] px-3 py-2 rounded mt-1 break-all">
              {address}
            </code>
          </div>

          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider">Destination Address</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="rDestination..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
            />
          </div>

          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider">
              Amount ({mode === "xrp" ? "XRP" : "RLUSD"})
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
            />
          </div>

          {mode === "rlusd" && (
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider">RLUSD Issuer</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="rIssuer..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
              />
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={loading || !destination || !amount}
            className="w-full bg-xrpl-accent hover:bg-xrpl-accent-muted text-xrpl-dark font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Sending...
              </span>
            ) : (
              `Send ${mode.toUpperCase()}`
            )}
          </button>
        </div>
      </Card>

      {/* Result */}
      {result && (
        <Card title="Transaction Result">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-white/50">Status:</span>
              <StatusBadge status={result.status} />
            </div>
            <div>
              <span className="text-white/50">Hash:</span>
              <a
                href={`https://testnet.xrpl.org/transactions/${result.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-xrpl-light hover:text-xrpl-accent bg-white/[0.04] border border-white/[0.06] px-3 py-2 rounded mt-1 break-all underline decoration-dotted"
              >
                {result.hash}
              </a>
            </div>
            <div>
              <span className="text-white/50">Amount:</span>
              <span className="text-white ml-2">{result.amount} {result.currency || "XRP"}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
