import { useState, useEffect } from "react";
import Card from "../components/Card";
import InfoTooltip from "../components/InfoTooltip";
import StatusBadge from "../components/StatusBadge";
import * as api from "../api/client";

interface Props {
  seed: string;
  address: string;
}

export default function EscrowPage({ seed, address }: Props) {
  // Create form
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [finishMinutes, setFinishMinutes] = useState("5");
  const [cancelMinutes, setCancelMinutes] = useState("");

  // Finish form
  const [finishOwner, setFinishOwner] = useState("");
  const [finishSequence, setFinishSequence] = useState("");

  // Cancel form
  const [cancelOwner, setCancelOwner] = useState("");
  const [cancelSequence, setCancelSequence] = useState("");

  const [loading, setLoading] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [escrows, setEscrows] = useState<any[]>([]);

  useEffect(() => {
    if (address) {
      api.listEscrows(address).then(setEscrows).catch(() => {});
    }
  }, [address]);

  if (!seed) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/60">Create a wallet first to manage escrows.</p>
      </div>
    );
  }

  function clearAlerts() {
    setError("");
    setSuccess("");
    setResult(null);
  }

  async function handleCreate() {
    setLoading("create");
    clearAlerts();
    try {
      const res = await api.createEscrow({
        senderSeed: seed,
        destination,
        amount,
        finishAfterMinutes: Number(finishMinutes),
        cancelAfterMinutes: cancelMinutes ? Number(cancelMinutes) : undefined,
      });
      setResult(res);
      setSuccess("Escrow created successfully!");
      const esc = await api.listEscrows(address);
      setEscrows(esc);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading("");
    }
  }

  async function handleFinish() {
    setLoading("finish");
    clearAlerts();
    try {
      const res = await api.finishEscrow({
        finisherSeed: seed,
        owner: finishOwner,
        offerSequence: Number(finishSequence),
      });
      setResult(res);
      setSuccess("Escrow released successfully!");
      const esc = await api.listEscrows(address);
      setEscrows(esc);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading("");
    }
  }

  async function handleCancel() {
    setLoading("cancel");
    clearAlerts();
    try {
      const res = await api.cancelEscrow({
        cancellerSeed: seed,
        owner: cancelOwner,
        offerSequence: Number(cancelSequence),
      });
      setResult(res);
      setSuccess("Escrow cancelled successfully!");
      const esc = await api.listEscrows(address);
      setEscrows(esc);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        Smart Escrow
        <InfoTooltip
          title="Escrow"
          content="Escrow locks XRP until a condition is met. Time-based escrow releases to a destination after a set time; you can optionally set a later time after which the owner can cancel and get funds back."
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

      {/* Create Escrow */}
      <Card title="Create Time-Based Escrow">
        <div className="space-y-4">
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
            <label className="text-white/50 text-xs uppercase tracking-wider">Amount (XRP)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider">Release After (minutes)</label>
              <input
                type="number"
                value={finishMinutes}
                onChange={(e) => setFinishMinutes(e.target.value)}
                placeholder="5"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider">Cancel After (minutes, optional)</label>
              <input
                type="number"
                value={cancelMinutes}
                onChange={(e) => setCancelMinutes(e.target.value)}
                placeholder="60"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!!loading || !destination || !amount || !finishMinutes}
            className="w-full bg-xrpl-accent hover:bg-xrpl-accent-muted text-xrpl-dark font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === "create" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Creating Escrow...
              </span>
            ) : (
              "Create Escrow"
            )}
          </button>
        </div>
      </Card>

      {/* Finish / Cancel in side-by-side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Finish Escrow */}
        <Card title="Release Escrow">
          <div className="space-y-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider">Escrow Owner Address</label>
              <input
                type="text"
                value={finishOwner}
                onChange={(e) => setFinishOwner(e.target.value)}
                placeholder="rOwner..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider">Offer Sequence</label>
              <input
                type="number"
                value={finishSequence}
                onChange={(e) => setFinishSequence(e.target.value)}
                placeholder="12345"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
              />
            </div>
            <button
              onClick={handleFinish}
              disabled={!!loading || !finishOwner || !finishSequence}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading === "finish" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Releasing...
                </span>
              ) : (
                "Release Escrow"
              )}
            </button>
          </div>
        </Card>

        {/* Cancel Escrow */}
        <Card title="Cancel Escrow">
          <div className="space-y-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider">Escrow Owner Address</label>
              <input
                type="text"
                value={cancelOwner}
                onChange={(e) => setCancelOwner(e.target.value)}
                placeholder="rOwner..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider">Offer Sequence</label>
              <input
                type="number"
                value={cancelSequence}
                onChange={(e) => setCancelSequence(e.target.value)}
                placeholder="12345"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white mt-1 focus:outline-none focus:border-xrpl-accent placeholder-white/40"
              />
            </div>
            <button
              onClick={handleCancel}
              disabled={!!loading || !cancelOwner || !cancelSequence}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading === "cancel" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Cancelling...
                </span>
              ) : (
                "Cancel Escrow"
              )}
            </button>
          </div>
        </Card>
      </div>

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
            {result.amount && (
              <div>
                <span className="text-white/50">Amount:</span>
                <span className="text-white ml-2">{result.amount} XRP</span>
              </div>
            )}
            {result.finishAfter && (
              <div>
                <span className="text-white/50">Releases after:</span>
                <span className="text-white ml-2">{result.finishAfter}</span>
              </div>
            )}
            {result.sequence && (
              <div>
                <span className="text-white/50">Sequence:</span>
                <span className="text-white ml-2">{result.sequence}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Active Escrows */}
      <Card title="Active Escrows">
        {escrows.length === 0 ? (
          <p className="text-white/50">No active escrows.</p>
        ) : (
          <>
            <p className="text-white/60 text-xs mb-3">
              For Release or Cancel, use <strong>Owner</strong> = account and <strong>Offer Sequence</strong> = sequence below.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/50 border-b border-white/10">
                    <th className="text-left py-2">Owner (Account)</th>
                    <th className="text-left py-2">Destination</th>
                    <th className="text-left py-2">Amount (XRP)</th>
                    <th className="text-left py-2">Sequence</th>
                    <th className="text-left py-2">Releases After</th>
                    <th className="text-left py-2">Cancels After</th>
                  </tr>
                </thead>
                <tbody>
                  {escrows.map((e: any, i: number) => (
                    <tr key={i} className="border-b border-white/10">
                      <td className="py-2 font-mono text-xs">{e.account ?? ""}</td>
                      <td className="py-2 font-mono text-xs">{e.destination ?? ""}</td>
                      <td className="py-2">{e.amount}</td>
                      <td className="py-2 font-mono text-xrpl-accent">{e.sequence}</td>
                      <td className="py-2 text-xs">{e.finishAfter ?? "N/A"}</td>
                      <td className="py-2 text-xs">{e.cancelAfter ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
