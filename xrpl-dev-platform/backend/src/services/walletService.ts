import { Wallet } from "xrpl";
import { ensureConnected } from "../xrpl/client";
import { generateFundedWallet, walletFromSeed } from "../xrpl/helpers";

export async function createWallet() {
  return generateFundedWallet();
}

export function restoreWallet(seed: string) {
  return walletFromSeed(seed);
}

export async function getBalance(address: string) {
  const client = await ensureConnected();
  const response = await client.request({
    command: "account_info",
    account: address,
    ledger_index: "validated",
  });
  const drops = response.result.account_data.Balance;
  return {
    address,
    balanceDrops: drops,
    balanceXrp: Number(drops) / 1_000_000,
  };
}
