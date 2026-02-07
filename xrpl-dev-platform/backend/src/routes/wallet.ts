import { Router, Request, Response } from "express";
import { createWallet, restoreWallet, getBalance } from "../services/walletService";

export const walletRoutes = Router();

walletRoutes.post("/create", async (_req: Request, res: Response) => {
  try {
    const wallet = await createWallet();
    res.json(wallet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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
