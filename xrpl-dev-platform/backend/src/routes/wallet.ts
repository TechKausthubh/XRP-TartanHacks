import { Router, Request, Response } from "express";
import { createWallet, restoreWallet, getBalance } from "../services/walletService";
import { listCreatedWallets, registerCreatedWallet } from "../store/walletStore";

export const walletRoutes = Router();

walletRoutes.post("/create", async (_req: Request, res: Response) => {
  try {
    const wallet = await createWallet();
    registerCreatedWallet({ address: wallet.address, secret: wallet.secret ?? "", balance: wallet.balance });
    res.json(wallet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

walletRoutes.get("/list", (_req: Request, res: Response) => {
  res.json(listCreatedWallets());
});

walletRoutes.post("/restore", async (req: Request, res: Response) => {
  try {
    const { seed } = req.body;
    if (!seed) {
      res.status(400).json({ error: "seed is required" });
      return;
    }
    const wallet = restoreWallet(seed);
    res.json(wallet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

walletRoutes.get("/balance/:address", async (req: Request, res: Response) => {
  try {
    const balance = await getBalance(req.params.address);
    res.json(balance);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
