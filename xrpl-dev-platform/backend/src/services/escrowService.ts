import { Wallet, xrpToDrops, EscrowCreate, EscrowFinish, EscrowCancel } from "xrpl";
import { ensureConnected } from "../xrpl/client";

export interface CreateEscrowParams {
  senderSeed: string;
  destination: string;
  amount: string; // XRP
  finishAfterMinutes: number;
  cancelAfterMinutes?: number;
}

export interface FinishEscrowParams {
  finisherSeed: string;
  owner: string;
  offerSequence: number;
}

export interface CancelEscrowParams {
  cancellerSeed: string;
  owner: string;
  offerSequence: number;
}

/** Create a time-based escrow */
export async function createEscrow(params: CreateEscrowParams) {
  const client = await ensureConnected();
  const wallet = Wallet.fromSeed(params.senderSeed);

  const now = Math.floor(Date.now() / 1000) - 946684800; // Ripple epoch
  const finishAfter = now + params.finishAfterMinutes * 60;

  const tx: EscrowCreate = {
    TransactionType: "EscrowCreate",
    Account: wallet.classicAddress,
    Destination: params.destination,
    Amount: xrpToDrops(params.amount),
    FinishAfter: finishAfter,
  };

  if (params.cancelAfterMinutes) {
    tx.CancelAfter = now + params.cancelAfterMinutes * 60;
  }

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  const meta = result.result.meta as any;

  return {
    hash: result.result.hash,
    status: meta?.TransactionResult ?? "unknown",
    sender: wallet.classicAddress,
    destination: params.destination,
    amount: params.amount,
    sequence: result.result.Sequence,
    finishAfter: new Date((finishAfter + 946684800) * 1000).toISOString(),
  };
}

/** Finish (release) an escrow */
export async function finishEscrow(params: FinishEscrowParams) {
  const client = await ensureConnected();
  const wallet = Wallet.fromSeed(params.finisherSeed);

  const tx: EscrowFinish = {
    TransactionType: "EscrowFinish",
    Account: wallet.classicAddress,
    Owner: params.owner,
    OfferSequence: params.offerSequence,
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  return {
    hash: result.result.hash,
    status: (result.result.meta as any)?.TransactionResult ?? "unknown",
  };
}

/** Cancel an expired escrow */
export async function cancelEscrow(params: CancelEscrowParams) {
  const client = await ensureConnected();
  const wallet = Wallet.fromSeed(params.cancellerSeed);

  const tx: EscrowCancel = {
    TransactionType: "EscrowCancel",
    Account: wallet.classicAddress,
    Owner: params.owner,
    OfferSequence: params.offerSequence,
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  return {
    hash: result.result.hash,
    status: (result.result.meta as any)?.TransactionResult ?? "unknown",
  };
}

/** List escrows for an account */
export async function listEscrows(address: string) {
  const client = await ensureConnected();
  const response = await client.request({
    command: "account_objects",
    account: address,
    type: "escrow",
    ledger_index: "validated",
  });

  return response.result.account_objects.map((obj: any) => ({
    account: obj.Account,
    destination: obj.Destination,
    amount: Number(obj.Amount) / 1_000_000,
    finishAfter: obj.FinishAfter
      ? new Date((obj.FinishAfter + 946684800) * 1000).toISOString()
      : null,
    cancelAfter: obj.CancelAfter
      ? new Date((obj.CancelAfter + 946684800) * 1000).toISOString()
      : null,
    sequence: obj.PreviousTxnLgrSeq,
  }));
}
