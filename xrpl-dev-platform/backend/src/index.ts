import express from "express";
import cors from "cors";
import { walletRoutes } from "./routes/wallet";
import { paymentRoutes } from "./routes/payment";
import { escrowRoutes } from "./routes/escrow";
import { accountRoutes } from "./routes/account";
import { xrplClient } from "./xrpl/client";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/wallet", walletRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", paymentRoutes);  // mounts /api/pay convenience route
app.use("/api/escrow", escrowRoutes);
app.use("/api/account", accountRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", network: "testnet" });
});

async function start() {
  try {
    await xrplClient.connect();
    console.log("Connected to XRPL Testnet");

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to XRPL:", err);
    process.exit(1);
  }
}

start();
