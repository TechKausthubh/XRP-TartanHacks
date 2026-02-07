import { Router, Request, Response } from "express";
import { createEscrow, finishEscrow, cancelEscrow, listEscrows } from "../services/escrowService";

export const escrowRoutes = Router();

escrowRoutes.post("/create", async (req: Request, res: Response) => {
  try {
    const { senderSeed, destination, amount, finishAfterMinutes, cancelAfterMinutes } = req.body;
    if (!senderSeed || !destination || !amount || !finishAfterMinutes) {
      res.status(400).json({ error: "senderSeed, destination, amount, and finishAfterMinutes are required" });
      return;
    }
    const result = await createEscrow({ senderSeed, destination, amount, finishAfterMinutes, cancelAfterMinutes });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

escrowRoutes.post("/finish", async (req: Request, res: Response) => {
  try {
    const { finisherSeed, owner, offerSequence } = req.body;
    if (!finisherSeed || !owner || !offerSequence) {
      res.status(400).json({ error: "finisherSeed, owner, and offerSequence are required" });
      return;
    }
    const result = await finishEscrow({ finisherSeed, owner, offerSequence });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

escrowRoutes.post("/cancel", async (req: Request, res: Response) => {
  try {
    const { cancellerSeed, owner, offerSequence } = req.body;
    if (!cancellerSeed || !owner || !offerSequence) {
      res.status(400).json({ error: "cancellerSeed, owner, and offerSequence are required" });
      return;
    }
    const result = await cancelEscrow({ cancellerSeed, owner, offerSequence });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

escrowRoutes.get("/list/:address", async (req: Request, res: Response) => {
  try {
    const escrows = await listEscrows(req.params.address);
    res.json(escrows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
