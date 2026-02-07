export interface StoredWallet {
  address: string;
  secret: string;
  balance: number;
  createdAt: string;
}

const wallets: StoredWallet[] = [];

export function registerCreatedWallet(w: { address: string; secret: string; balance: number }) {
  wallets.push({
    ...w,
    createdAt: new Date().toISOString(),
  });
}

export function listCreatedWallets(): StoredWallet[] {
  return [...wallets];
}
