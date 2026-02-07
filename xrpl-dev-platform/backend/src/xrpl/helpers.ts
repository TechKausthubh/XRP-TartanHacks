import { Wallet, dropsToXrp, xrpToDrops } from "xrpl";
import { ensureConnected } from "./client";

// One-line SDK helpers for XRPL

/** Generate a funded testnet wallet in one call */
export async function generateFundedWallet() {
  const client = await ensureConnected();
  const { wallet, balance } = await client.fundWallet();
  return {
    address: wallet.classicAddress,
    secret: wallet.seed,
    publicKey: wallet.publicKey,
    balance: Number(dropsToXrp(String(balance))),
  };
}

/** Restore a wallet from a secret seed */
export function walletFromSeed(seed: string) {
  const wallet = Wallet.fromSeed(seed);
  return {
    address: wallet.classicAddress,
    publicKey: wallet.publicKey,
  };
}

/** Convert XRP to drops */
export function toDrops(xrp: string): string {
  return xrpToDrops(xrp);
}

/** Convert drops to XRP */
export function fromDrops(drops: string): string {
  return String(dropsToXrp(drops));
}
