import Card from "../components/Card";

const snippets = [
  {
    title: "1. Create a Wallet",
    description: "Generate a funded testnet wallet in one call. Returns address, seed, and balance.",
    code: `import { xrplSDK } from "./xrpl/sdk";

const wallet = await xrplSDK.createWallet();
// => { address: "rXXX...", secret: "sEdXXX...", balance: 100 }`,
  },
  {
    title: "2. Check Balance",
    description: "Fetch the XRP balance for any address.",
    code: `const balance = await xrplSDK.getBalance("rXXX...");
// => { address: "rXXX...", balanceXrp: 99.5 }`,
  },
  {
    title: "3. Send a Payment",
    description: "Transfer XRP with a single function call. Handles signing, submission, and validation.",
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
    code: `const result = await xrplSDK.cancelEscrow({
  seed: "sEdXXX...",
  escrowOwner: "rOwner...",
  offerSequence: 42
});
// => { hash: "JKL012...", status: "tesSUCCESS" }`,
  },
];

const restSnippets = [
  {
    title: "POST /api/wallet/create",
    code: `curl -X POST http://localhost:4000/api/wallet/create`,
  },
  {
    title: "GET /api/wallet/balance/:address",
    code: `curl http://localhost:4000/api/wallet/balance/rXXX...`,
  },
  {
    title: "POST /api/pay",
    code: `curl -X POST http://localhost:4000/api/pay \\
  -H "Content-Type: application/json" \\
  -d '{"seed":"sEdXXX...","toAddress":"rDest...","amountXRP":"10"}'`,
  },
  {
    title: "POST /api/escrow/create",
    code: `curl -X POST http://localhost:4000/api/escrow/create \\
  -H "Content-Type: application/json" \\
  -d '{"senderSeed":"sEdXXX...","destination":"rDest...","amount":"50","finishAfterMinutes":5}'`,
  },
  {
    title: "POST /api/escrow/finish",
    code: `curl -X POST http://localhost:4000/api/escrow/finish \\
  -H "Content-Type: application/json" \\
  -d '{"finisherSeed":"sEdXXX...","owner":"rOwner...","offerSequence":42}'`,
  },
  {
    title: "POST /api/escrow/cancel",
    code: `curl -X POST http://localhost:4000/api/escrow/cancel \\
  -H "Content-Type: application/json" \\
  -d '{"cancellerSeed":"sEdXXX...","owner":"rOwner...","offerSequence":42}'`,
  },
];

export default function QuickstartPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-xrpl-blue/20 rounded-lg flex items-center justify-center">
            <span className="text-xrpl-accent font-bold text-lg">X</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Dev Quickstart</h2>
        </div>
        <p className="text-gray-400 mt-2">
          Build on XRPL in minutes. Our SDK wraps the complexity of XRP Ledger transactions into simple, one-line function calls &mdash; like Stripe for blockchain.
        </p>
      </div>

      {/* Install */}
      <Card title="Installation">
        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
          <span className="text-gray-500">$</span>{" "}
          <span className="text-green-400">npm install xrpl</span>
        </div>
        <p className="text-gray-500 text-sm mt-3">
          That&apos;s it. Import the SDK and start building.
        </p>
      </Card>

      {/* SDK Examples */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">SDK Reference</h3>
        <div className="space-y-4">
          {snippets.map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h4 className="text-white font-semibold">{s.title}</h4>
                <p className="text-gray-500 text-sm mt-1">{s.description}</p>
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
        <p className="text-gray-400 text-sm mb-4">
          Prefer HTTP? Every SDK function is also exposed as a REST endpoint.
        </p>
        <div className="space-y-4">
          {restSnippets.map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-800 flex items-center gap-2">
                <span className="text-xs bg-xrpl-blue/30 text-xrpl-light px-2 py-0.5 rounded font-mono">
                  {s.title.split(" ")[0]}
                </span>
                <span className="text-white font-mono text-sm">{s.title.split(" ").slice(1).join(" ")}</span>
              </div>
              <pre className="px-6 py-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{s.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <Card title="Architecture">
        <div className="text-sm text-gray-400 space-y-3">
          <p>The platform is organized into clean layers:</p>
          <div className="bg-gray-800 rounded-lg p-4 font-mono text-xs space-y-1">
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
