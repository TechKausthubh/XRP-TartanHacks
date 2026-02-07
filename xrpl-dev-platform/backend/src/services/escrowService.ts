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
  // OfferSequence for EscrowFinish/EscrowCancel must be the Sequence of the EscrowCreate tx
  const offerSequence = prepared.Sequence!;

  return {
    hash: result.result.hash,
    status: meta?.TransactionResult ?? "unknown",
    sender: wallet.classicAddress,
    destination: params.destination,
    amount: params.amount,
    sequence: offerSequence,
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

/** List escrows for an account. Fetches OfferSequence from the creating tx so finish/cancel work. */
export async function listEscrows(address: string) {
  const client = await ensureConnected();
  const response = await client.request({
    command: "account_objects",
    account: address,
    type: "escrow",
    ledger_index: "validated",
  });

  const list = await Promise.all(
    response.result.account_objects.map(async (obj: any) => {
      let offerSequence: number = obj.PreviousTxnLgrSeq;
      try {
        const txRes = await client.request({
          command: "tx",
          transaction: obj.PreviousTxnID,
        });
        offerSequence = (txRes.result as any).Sequence;
      } catch {
        // keep ledger seq as fallback (wrong for finish/cancel but at least we return something)
      }
      return {
        account: obj.Account,
        destination: obj.Destination,
        amount: Number(obj.Amount) / 1_000_000,
        finishAfter: obj.FinishAfter
          ? new Date((obj.FinishAfter + 946684800) * 1000).toISOString()
          : null,
        cancelAfter: obj.CancelAfter
          ? new Date((obj.CancelAfter + 946684800) * 1000).toISOString()
          : null,
        sequence: offerSequence,
      };
    })
  );

  return list;
}
