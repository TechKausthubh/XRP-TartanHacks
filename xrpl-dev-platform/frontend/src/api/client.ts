const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// Wallet
export const createWallet = () => request<any>("/wallet/create", { method: "POST" });
export const restoreWallet = (seed: string) =>
  request<any>("/wallet/restore", { method: "POST", body: JSON.stringify({ seed }) });
export const getBalance = (address: string) => request<any>(`/wallet/balance/${address}`);
export const listWallets = () => request<any>("/wallet/list");

// Account
export const getAccountInfo = (address: string) => request<any>(`/account/info/${address}`);
export const getTransactions = (address: string) => request<any>(`/account/transactions/${address}`);
export const getTrustLines = (address: string) => request<any>(`/account/trustlines/${address}`);

// Payments
export const sendXRP = (data: { senderSeed: string; destination: string; amount: string }) =>
  request<any>("/payment/send-xrp", { method: "POST", body: JSON.stringify(data) });
export const sendRLUSD = (data: { senderSeed: string; destination: string; amount: string; issuer: string }) =>
  request<any>("/payment/send-rlusd", { method: "POST", body: JSON.stringify(data) });

// Escrow
export const createEscrow = (data: {
  senderSeed: string;
  destination: string;
  amount: string;
  finishAfterMinutes: number;
  cancelAfterMinutes?: number;
}) => request<any>("/escrow/create", { method: "POST", body: JSON.stringify(data) });
export const finishEscrow = (data: { finisherSeed: string; owner: string; offerSequence: number }) =>
  request<any>("/escrow/finish", { method: "POST", body: JSON.stringify(data) });
export const cancelEscrow = (data: { cancellerSeed: string; owner: string; offerSequence: number }) =>
  request<any>("/escrow/cancel", { method: "POST", body: JSON.stringify(data) });
export const listEscrows = (address: string) => request<any>(`/escrow/list/${address}`);

// AI: chat with Dedalus Labs for SDK code generation (key from backend .env)
export type AiMessage = { role: "user" | "assistant"; content: string };
export const aiGenerate = (messages: AiMessage[]) =>
  request<{ content: string }>("/ai/generate", { method: "POST", body: JSON.stringify({ messages }) });
