/**
 * Template-based "AI" code generator: maps natural language to XRPL SDK snippets.
 * Replace with a real LLM API (e.g. OpenAI) for production.
 */

const ESCROW_CREATE_DAYS = `// Escrow that releases in 7 days
const escrow = await xrplSDK.createEscrow({
  seed: "sEdXXX...",
  receiver: "rDestination...",
  amountXRP: "50",
  releaseSeconds: 7 * 24 * 60 * 60  // 7 days in seconds
});
// => { hash: "...", sequence: N } — use sequence to release/cancel later`;

const ESCROW_CREATE_MINUTES = `// Escrow that releases after 5 minutes
const escrow = await xrplSDK.createEscrow({
  seed: "sEdXXX...",
  receiver: "rDestination...",
  amountXRP: "50",
  releaseSeconds: 300  // 5 minutes
});
// => { hash: "...", sequence: N }`;

const PAYMENT = `// Send XRP payment
const tx = await xrplSDK.pay({
  seed: "sEdXXX...",
  toAddress: "rDestination...",
  amountXRP: "25"
});
// => { hash: "ABC123...", status: "tesSUCCESS" }`;

const WALLET = `// Create a funded testnet wallet
const wallet = await xrplSDK.createWallet();
// => { address: "rXXX...", secret: "sEdXXX...", balance: 100 }`;

const BALANCE = `// Check XRP balance for an address
const balance = await xrplSDK.getBalance("rXXX...");
// => { address: "rXXX...", balanceXrp: 99.5 }`;

const RELEASE_ESCROW = `// Release (finish) an escrow after the release time
const result = await xrplSDK.releaseEscrow({
  seed: "sEdXXX...",
  escrowOwner: "rOwner...",
  offerSequence: 42
});
// => { hash: "...", status: "tesSUCCESS" }`;

const CANCEL_ESCROW = `// Cancel an expired escrow (funds return to owner)
const result = await xrplSDK.cancelEscrow({
  seed: "sEdXXX...",
  escrowOwner: "rOwner...",
  offerSequence: 42
});
// => { hash: "...", status: "tesSUCCESS" }`;

export function generateCodeFromDescription(description: string): string {
  const lower = description.toLowerCase().trim();
  const daysMatch = lower.match(/(\d+)\s*day/i) || lower.match(/in\s*(\d+)\s*day/i);
  const minutesMatch = lower.match(/(\d+)\s*minute/i);

  if (/\bescrow\b/.test(lower)) {
    if (/\brelease\b|\bfinish\b|\bclaim\b/.test(lower) && !/create|lock|put/.test(lower))
      return RELEASE_ESCROW;
    if (/\bcancel\b/.test(lower)) return CANCEL_ESCROW;
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      return ESCROW_CREATE_DAYS.replace("7 days", `${days} days`).replace("7 * 24 * 60 * 60", `${days} * 24 * 60 * 60`);
    }
    if (minutesMatch) {
      const mins = parseInt(minutesMatch[1], 10);
      return ESCROW_CREATE_MINUTES.replace("5 minutes", `${mins} minutes`).replace("300", String(mins * 60));
    }
    return ESCROW_CREATE_DAYS;
  }

  if (/\bwallet\b/.test(lower) && (/\bcreate\b|\bnew\b|\bgenerate\b/.test(lower) || lower.length < 20))
    return WALLET;
  if (/\bbalance\b/.test(lower) || /\bcheck\s+(xrp\s+)?balance\b/.test(lower))
    return BALANCE;
  if (/\bpay\b|\bpayment\b|\bsend\s+xrp\b|\btransfer\b/.test(lower))
    return PAYMENT;

  return WALLET + "\n\n// Or try: payment, escrow (with 'release in X days'), balance.";
}
