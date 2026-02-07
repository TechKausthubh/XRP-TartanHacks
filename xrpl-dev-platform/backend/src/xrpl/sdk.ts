import { createWallet, getBalance } from "../services/walletService";
import { sendXRP } from "../services/paymentService";
import { createEscrow, finishEscrow, cancelEscrow } from "../services/escrowService";

/**
 * XRPL Developer SDK — one-line helpers for XRP Ledger.
 *
 * Usage:
 *   import { xrplSDK } from "./xrpl/sdk";
 *   const wallet = await xrplSDK.createWallet();
 *   await xrplSDK.pay({ senderSeed: wallet.secret, destination: "r...", amount: "10" });
 */
export const xrplSDK = {
  /** Generate a funded testnet wallet */
  createWallet,

  /** Get XRP balance for an address */
  getBalance,

  /** Send XRP in one line */
  pay: ({ seed, toAddress, amountXRP }: { seed: string; toAddress: string; amountXRP: string }) =>
    sendXRP({ senderSeed: seed, destination: toAddress, amount: amountXRP }),

  /** Create a time-based escrow */
  createEscrow: ({
    seed,
    receiver,
    amountXRP,
    releaseSeconds,
  }: {
    seed: string;
    receiver: string;
    amountXRP: string;
    releaseSeconds: number;
  }) =>
    createEscrow({
      senderSeed: seed,
      destination: receiver,
      amount: amountXRP,
      finishAfterMinutes: releaseSeconds / 60,
    }),

  /** Release (finish) an escrow */
  releaseEscrow: ({
    seed,
    escrowOwner,
    offerSequence,
  }: {
    seed: string;
    escrowOwner: string;
    offerSequence: number;
  }) =>
    finishEscrow({ finisherSeed: seed, owner: escrowOwner, offerSequence }),

  /** Cancel an expired escrow */
  cancelEscrow: ({
    seed,
    escrowOwner,
    offerSequence,
  }: {
    seed: string;
    escrowOwner: string;
    offerSequence: number;
  }) =>
    cancelEscrow({ cancellerSeed: seed, owner: escrowOwner, offerSequence }),
};

export default xrplSDK;
