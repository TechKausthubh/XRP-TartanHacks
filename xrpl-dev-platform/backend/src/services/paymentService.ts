import { Wallet, Payment, xrpToDrops } from "xrpl";
import { ensureConnected } from "../xrpl/client";

export interface PaymentParams {
  senderSeed: string;
  destination: string;
  amount: string; // XRP amount
}

export interface RLUSDPaymentParams {
  senderSeed: string;
  destination: string;
  amount: string; // RLUSD amount
  issuer: string; // RLUSD issuer address
}

/** Send XRP from one wallet to another */
export async function sendXRP(params: PaymentParams) {
  const client = await ensureConnected();
  const wallet = Wallet.fromSeed(params.senderSeed);

  const tx: Payment = {
    TransactionType: "Payment",
    Account: wallet.classicAddress,
    Destination: params.destination,
    Amount: xrpToDrops(params.amount),
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  return {
    hash: result.result.hash,
    status: result.result.meta && typeof result.result.meta === "object"
      ? (result.result.meta as any).TransactionResult
      : "unknown",
    sender: wallet.classicAddress,
    destination: params.destination,
    amount: params.amount,
  };
}

/** Send RLUSD (issued currency) from one wallet to another */
export async function sendRLUSD(params: RLUSDPaymentParams) {
  const client = await ensureConnected();
  const wallet = Wallet.fromSeed(params.senderSeed);

  const tx: Payment = {
    TransactionType: "Payment",
    Account: wallet.classicAddress,
    Destination: params.destination,
    Amount: {
      currency: "RLUSD",
      value: params.amount,
      issuer: params.issuer,
    },
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  return {
    hash: result.result.hash,
    status: result.result.meta && typeof result.result.meta === "object"
      ? (result.result.meta as any).TransactionResult
      : "unknown",
    sender: wallet.classicAddress,
    destination: params.destination,
    amount: params.amount,
    currency: "RLUSD",
  };
}
