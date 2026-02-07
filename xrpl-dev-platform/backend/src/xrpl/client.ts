import { Client } from "xrpl";

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

export const xrplClient = new Client(TESTNET_URL);

export async function ensureConnected(): Promise<Client> {
  if (!xrplClient.isConnected()) {
    await xrplClient.connect();
  }
  return xrplClient;
}
