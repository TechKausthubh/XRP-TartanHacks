import { ensureConnected } from "../xrpl/client";

/** Get full account info */
export async function getAccountInfo(address: string) {
  const client = await ensureConnected();
  const response = await client.request({
    command: "account_info",
    account: address,
    ledger_index: "validated",
  });

  const data = response.result.account_data;
  return {
    address: data.Account,
    balance: Number(data.Balance) / 1_000_000,
    sequence: data.Sequence,
    ownerCount: data.OwnerCount,
  };
}

/** Get recent transactions for an account */
export async function getTransactions(address: string, limit = 20) {
  const client = await ensureConnected();
  const response = await client.request({
    command: "account_tx",
    account: address,
    limit,
    ledger_index_min: -1,
    ledger_index_max: -1,
  });

  return response.result.transactions.map((tx: any) => ({
    hash: tx.tx_json?.hash ?? tx.tx?.hash ?? tx.hash,
    type: tx.tx_json?.TransactionType ?? tx.tx?.TransactionType,
    from: tx.tx_json?.Account ?? tx.tx?.Account,
    to: tx.tx_json?.Destination ?? tx.tx?.Destination,
    amount: tx.tx_json?.Amount ?? tx.tx?.Amount,
    date: tx.tx_json?.date ?? tx.tx?.date,
    status: tx.meta?.TransactionResult,
  }));
}

/** Get trust lines for an account */
export async function getTrustLines(address: string) {
  const client = await ensureConnected();
  const response = await client.request({
    command: "account_lines",
    account: address,
    ledger_index: "validated",
  });

  return response.result.lines.map((line: any) => ({
    currency: line.currency,
    balance: line.balance,
    limit: line.limit,
    peer: line.account,
  }));
}
