import { Router, Request, Response } from "express";
import { sendXRP, sendRLUSD } from "../services/paymentService";

export const paymentRoutes = Router();

paymentRoutes.post("/send-xrp", async (req: Request, res: Response) => {
  try {
    const { senderSeed, destination, amount } = req.body;
    if (!senderSeed || !destination || !amount) {
      res.status(400).json({ error: "senderSeed, destination, and amount are required" });
      return;
    }
    const result = await sendXRP({ senderSeed, destination, amount });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Convenience alias: POST /pay { seed, toAddress, amountXRP }
paymentRoutes.post("/pay", async (req: Request, res: Response) => {
  try {
    const { seed, toAddress, amountXRP } = req.body;
    if (!seed || !toAddress || !amountXRP) {
      res.status(400).json({ error: "seed, toAddress, and amountXRP are required" });
      return;
    }
    const result = await sendXRP({ senderSeed: seed, destination: toAddress, amount: amountXRP });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

paymentRoutes.post("/send-rlusd", async (req: Request, res: Response) => {
  try {
    const { senderSeed, destination, amount, issuer } = req.body;
    if (!senderSeed || !destination || !amount || !issuer) {
      res.status(400).json({ error: "senderSeed, destination, amount, and issuer are required" });
      return;
    }
    const result = await sendRLUSD({ senderSeed, destination, amount, issuer });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
