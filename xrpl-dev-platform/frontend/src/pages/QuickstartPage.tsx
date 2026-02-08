import { useState, useEffect } from "react";
import Card from "../components/Card";
import InfoTooltip from "../components/InfoTooltip";
import * as api from "../api/client";

const FEATURE_GUIDES: Record<string, { title: string; content: string }> = {
  wallet: {
    title: "Wallet",
    content: "A wallet holds your keys (address + secret). On XRPL, the address (rXXX...) receives XRP; the secret (seed) signs transactions. Never share your secret.",
  },
  balance: {
    title: "Balance",
    content: "XRP balance is stored on the ledger per address. 1 XRP = 1,000,000 drops. This call reads the current balance from the network.",
  },
  payment: {
    title: "Payment",
    content: "A Payment transaction moves XRP (or issued currency) from one account to another. It is final once the ledger closes (~3–5 seconds).",
  },
  escrow: {
    title: "Escrow",
    content: "Escrow locks XRP until a condition is met. Time-based escrow releases to a destination after a set time, or can be cancelled after a later time.",
  },
  releaseEscrow: {
    title: "Release Escrow",
    content: "After the release time has passed, the destination account can 'finish' the escrow to receive the XRP. The transaction uses the escrow owner's sequence number.",
  },
  cancelEscrow: {
    title: "Cancel Escrow",
    content: "If a cancel-after time was set and has passed, the owner can cancel the escrow and get the XRP back. The destination cannot claim after cancel.",
  },
};

const snippets = [
  {
    title: "1. Create a Wallet",
    description: "Generate a funded testnet wallet in one call. Returns address, seed, and balance.",
    guideKey: "wallet",
    code: `import { xrplSDK } from "./xrpl/sdk";

const wallet = await xrplSDK.createWallet();
// => { address: "rXXX...", secret: "sEdXXX...", balance: 100 }`,
  },
  {
    title: "2. Check Balance",
    description: "Fetch the XRP balance for any address.",
    guideKey: "balance",
    code: `const balance = await xrplSDK.getBalance("rXXX...");
// => { address: "rXXX...", balanceXrp: 99.5 }`,
  },
  {
    title: "3. Send a Payment",
    description: "Transfer XRP with a single function call. Handles signing, submission, and validation.",
    guideKey: "payment",
    code: `const tx = await xrplSDK.pay({
  seed: "sEdXXX...",
  toAddress: "rDestination...",
  amountXRP: "25"
});
// => { hash: "ABC123...", status: "tesSUCCESS" }`,
  },
  {
    title: "4. Create an Escrow",
    description: "Lock XRP in a time-based escrow. Funds release after the specified duration.",
    guideKey: "escrow",
    code: `const escrow = await xrplSDK.createEscrow({
  seed: "sEdXXX...",
  receiver: "rDestination...",
  amountXRP: "50",
  releaseSeconds: 300  // 5 minutes
});
// => { hash: "DEF456...", sequence: 42 }`,
  },
  {
    title: "5. Release an Escrow",
    description: "Finish an escrow after the release time has passed.",
    guideKey: "releaseEscrow",
    code: `const result = await xrplSDK.releaseEscrow({
  seed: "sEdXXX...",
  escrowOwner: "rOwner...",
  offerSequence: 42
});
// => { hash: "GHI789...", status: "tesSUCCESS" }`,
  },
  {
    title: "6. Cancel an Escrow",
    description: "Cancel an expired escrow and return funds to the owner.",
    guideKey: "cancelEscrow",
    code: `const result = await xrplSDK.cancelEscrow({
  seed: "sEdXXX...",
  escrowOwner: "rOwner...",
  offerSequence: 42
});
// => { hash: "JKL012...", status: "tesSUCCESS" }`,
  },
];

const restSnippets = [
  { title: "POST /api/wallet/create", code: `curl -X POST http://localhost:4000/api/wallet/create` },
  { title: "GET /api/wallet/balance/:address", code: `curl http://localhost:4000/api/wallet/balance/rXXX...` },
  { title: "POST /api/pay", code: `curl -X POST http://localhost:4000/api/pay \\
  -H "Content-Type: application/json" \\
  -d '{"seed":"sEdXXX...","toAddress":"rDest...","amountXRP":"10"}'` },
  { title: "POST /api/escrow/create", code: `curl -X POST http://localhost:4000/api/escrow/create \\
  -H "Content-Type: application/json" \\
  -d '{"senderSeed":"sEdXXX...","destination":"rDest...","amount":"50","finishAfterMinutes":5}'` },
  { title: "POST /api/escrow/finish", code: `curl -X POST http://localhost:4000/api/escrow/finish \\
  -H "Content-Type: application/json" \\
  -d '{"finisherSeed":"sEdXXX...","owner":"rOwner...","offerSequence":42}'` },
  { title: "POST /api/escrow/cancel", code: `curl -X POST http://localhost:4000/api/escrow/cancel \\
  -H "Content-Type: application/json" \\
  -d '{"cancellerSeed":"sEdXXX...","owner":"rOwner...","offerSequence":42}'` },
];

export default function QuickstartPage() {
  const [wallets, setWallets] = useState<{ address: string; secret: string; balance: number; createdAt: string }[]>([]);
  const [walletListError, setWalletListError] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const loadWallets = () => {
    setWalletListError("");
    api.listWallets().then(setWallets).catch(() => setWalletListError("Start the backend to list wallets."));
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const postmanDownloadUrl = "/api/postman-collection";

  async function handleAiSend() {
    const text = aiInput.trim();
    if (!text || aiLoading) return;
    setAiInput("");
    setAiError("");
    const userMsg = { role: "user" as const, content: text };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiLoading(true);
    try {
      const nextMessages = [...aiMessages, userMsg];
      const { content } = await api.aiGenerate(nextMessages);
      setAiMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (e: any) {
      setAiError(e.message || "Failed to get response");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-xrpl-accent/20 border border-xrpl-accent/20 rounded-lg flex items-center justify-center">
            <span className="text-xrpl-accent font-bold text-lg">X</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Dev Quickstart</h2>
        </div>
        <p className="text-white/60 mt-2">
          Build on XRPL in minutes. Our SDK wraps the complexity of XRP Ledger transactions into simple, one-line function calls &mdash; like Stripe for blockchain.
        </p>
      </div>

      {/* Postman collection */}
      <Card title="Postman Collection">
        <p className="text-white/60 text-sm mb-3">
          Import this collection into Postman to call Wallet, Payment, Escrow, and Account APIs directly. Base URL: <code className="text-xrpl-light">http://localhost:4000</code>. Set variables <code className="text-white/50">address</code> and <code className="text-white/50">seed</code> from the wallets list below.
        </p>
        <a
          href={postmanDownloadUrl}
          download="XRPL-Dev-Platform.postman_collection.json"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Download Postman collection
        </a>
      </Card>

      {/* Wallets created on testnet */}
      <Card title="Testnet Wallets (this session)">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-white/60 text-sm">
            Wallets created via &quot;Create Wallet&quot; in this session. Copy address/seed for payments and escrows.
          </p>
          <button
            type="button"
            onClick={loadWallets}
            className="text-sm text-xrpl-accent hover:underline shrink-0"
          >
            Refresh
          </button>
        </div>
        {walletListError && <p className="text-amber-500 text-sm mb-2">{walletListError}</p>}
        {wallets.length === 0 && !walletListError && (
          <p className="text-white/50 text-sm">No wallets created yet. Create one from the Wallet page.</p>
        )}
        {wallets.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {wallets.map((w, i) => (
              <div key={w.address} className="glass rounded-lg p-4 text-sm bg-white/[0.02]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-white/50">#{i + 1}</span>
                  <span className="text-xrpl-accent font-mono">{w.balance} XRP</span>
                </div>
                <div className="mb-1">
                  <span className="text-white/50 text-xs">Address</span>
                  <code className="block text-xrpl-light break-all mt-0.5">{w.address}</code>
                </div>
                <div>
                  <span className="text-white/50 text-xs">Secret (seed)</span>
                  <code className="block text-yellow-400 break-all mt-0.5">{w.secret}</code>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* AI: Chat → SDK code (Dedalus Labs) */}
      <Card title="AI: Describe what you want → SDK code">
        <p className="text-white/60 text-sm mb-3">
          Chat with the AI to get ready-to-run XRPL SDK code (powered by Dedalus Labs). Example: &quot;Create an escrow that releases in 7 days&quot;
        </p>
        {aiError && (
          <p className="text-amber-400 text-sm mb-2">{aiError}</p>
        )}
        <div className="bg-white/[0.04] rounded-lg border border-white/[0.06] min-h-[200px] max-h-[360px] overflow-y-auto flex flex-col">
          {aiMessages.length === 0 && (
            <p className="text-white/50 text-sm p-4">Send a message to generate code. Conversation context is kept so you can ask for changes.</p>
          )}
          <div className="p-3 space-y-3 flex-1">
            {aiMessages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-xrpl-accent/30 text-white border border-xrpl-accent/30"
                      : "bg-white/[0.06] text-white/90 border border-white/[0.06]"
                  }`}
                >
                  {m.role === "assistant" && /```/.test(m.content) ? (
                    <div className="space-y-2">
                      {m.content.split(/(```[\s\S]*?```)/g).map((part, j) =>
                        part.startsWith("```") ? (
                          <pre key={j} className="bg-white/[0.06] rounded p-3 overflow-x-auto text-xs text-xrpl-light mt-2 border border-white/[0.06]">
                            <code>{part.replace(/^```\w*\n?|```$/g, "").trim()}</code>
                          </pre>
                        ) : (
                          <span key={j} className="whitespace-pre-wrap">{part}</span>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  )}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <span className="bg-white/[0.06] text-white/60 rounded-lg px-4 py-2 text-sm border border-white/[0.06]">Generating...</span>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-white/[0.06] flex gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAiSend()}
              placeholder="e.g. Create an escrow that releases in 7 days"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-xrpl-accent"
              disabled={aiLoading}
            />
            <button
              onClick={handleAiSend}
              disabled={aiLoading || !aiInput.trim()}
              className="bg-xrpl-accent hover:bg-xrpl-accent-muted text-xrpl-dark font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </Card>

      {/* Install */}
      <Card title="Installation">
        <div className="glass rounded-lg p-4 font-mono text-sm bg-white/[0.02]">
          <span className="text-white/50">$</span> <span className="text-emerald-400">npm install xrpl</span>
        </div>
        <p className="text-white/50 text-sm mt-3">That&apos;s it. Import the SDK and start building.</p>
      </Card>

      {/* SDK Examples with tooltips */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">SDK Reference</h3>
        <div className="space-y-4">
          {snippets.map((s, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden bg-white/[0.02]">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-white font-semibold flex items-center">
                    {s.title}
                    <InfoTooltip
                      title={FEATURE_GUIDES[s.guideKey]?.title ?? s.title}
                      content={FEATURE_GUIDES[s.guideKey]?.content ?? s.description}
                    />
                  </h4>
                  <p className="text-white/50 text-sm mt-1">{s.description}</p>
                </div>
              </div>
              <pre className="px-6 py-4 overflow-x-auto text-sm">
                <code className="text-xrpl-light">{s.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* REST API */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">REST API Endpoints</h3>
        <p className="text-white/60 text-sm mb-4">Prefer HTTP? Every SDK function is also exposed as a REST endpoint.</p>
        <div className="space-y-4">
          {restSnippets.map((s, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden bg-white/[0.02]">
              <div className="px-6 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <span className="text-xs bg-xrpl-accent/20 text-xrpl-light px-2 py-0.5 rounded font-mono border border-xrpl-accent/20">
                  {s.title.split(" ")[0]}
                </span>
                <span className="text-white font-mono text-sm">{s.title.split(" ").slice(1).join(" ")}</span>
              </div>
              <pre className="px-6 py-4 overflow-x-auto text-sm">
                <code className="text-white/80">{s.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <Card title="Architecture">
        <div className="text-sm text-white/60 space-y-3">
          <p>The platform is organized into clean layers:</p>
          <div className="glass rounded-lg p-4 font-mono text-xs space-y-1 bg-white/[0.02]">
            <p className="text-xrpl-accent">xrpl/client.ts      &larr; XRPL connection (auto-reconnect)</p>
            <p className="text-xrpl-light">xrpl/sdk.ts          &larr; One-line developer SDK</p>
            <p className="text-green-400">services/*Service.ts &larr; Business logic layer</p>
            <p className="text-yellow-400">routes/*.ts          &larr; Express REST endpoints</p>
            <p className="text-purple-400">frontend/            &larr; React + Tailwind dashboard</p>
          </div>
          <p>
            Every service function connects to testnet automatically, signs transactions, submits them, and waits for validation. You never touch raw XRPL objects.
          </p>
        </div>
      </Card>
    </div>
  );
}
