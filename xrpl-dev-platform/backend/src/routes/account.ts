import { Router, Request, Response } from "express";
import { getAccountInfo, getTransactions, getTrustLines } from "../services/accountService";

export const accountRoutes = Router();

accountRoutes.get("/info/:address", async (req: Request, res: Response) => {
  try {
    const info = await getAccountInfo(req.params.address);
    res.json(info);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

accountRoutes.get("/transactions/:address", async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const txs = await getTransactions(req.params.address, limit);
    res.json(txs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

accountRoutes.get("/trustlines/:address", async (req: Request, res: Response) => {
  try {
    const lines = await getTrustLines(req.params.address);
    res.json(lines);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
