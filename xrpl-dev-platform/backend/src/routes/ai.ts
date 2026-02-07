import { Router, Request, Response } from "express";

const DEDALUS_API_URL = "https://api.dedaluslabs.ai/v1/chat/completions";

const SYSTEM_PROMPT = `You are an expert in the XRP Ledger (XRPL). You generate short, ready-to-run JavaScript/TypeScript code using this project's SDK.

SDK usage (import from "./xrpl/sdk" or similar):
- xrplSDK.createWallet() → { address, secret, balance }
- xrplSDK.getBalance(address)
- xrplSDK.pay({ seed, toAddress, amountXRP })
- xrplSDK.createEscrow({ seed, receiver, amountXRP, releaseSeconds }) → { hash, sequence }; releaseSeconds is in seconds (e.g. 7 days = 7*24*60*60)
- xrplSDK.releaseEscrow({ seed, escrowOwner, offerSequence })
- xrplSDK.cancelEscrow({ seed, escrowOwner, offerSequence })

Rules:
- Reply with only the code snippet the user asked for. No lengthy explanation unless they ask.
- Use the SDK above; no raw xrpl.js transaction building unless necessary.
- Use placeholder values like "sEdXXX...", "rXXX..." where the user must fill in.
- Keep snippets minimal and runnable.`;

export const aiRoutes = Router();

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

aiRoutes.post("/generate", async (req: Request, res: Response) => {
  const apiKey = process.env.DEDALUS_API_KEY?.trim();
  if (!apiKey) {
    res.status(503).json({
      error: "Set DEDALUS_API_KEY in the backend .env to enable AI code generation.",
    });
    return;
  }

  const { messages } = req.body as { messages?: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const apiMessages: { role: "user" | "assistant" | "system"; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m: ChatMessage) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  try {
    const response = await fetch(DEDALUS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: apiMessages,
        max_tokens: 1024,
        temperature: 0.2,
      }),
    });

    const raw = await response.text();
    let data: any;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      res.status(500).json({ error: "Invalid JSON response from LLM provider", detail: raw.slice(0, 200) });
      return;
    }

    if (!response.ok) {
      const errMsg = data?.error?.message ?? data?.message ?? response.statusText;
      res.status(response.status).json({ error: errMsg });
      return;
    }

    const content = data.choices?.[0]?.message?.content ?? "";
    if (!content) {
      res.status(500).json({ error: "Empty response from LLM", detail: JSON.stringify(data).slice(0, 300) });
      return;
    }
    res.json({ content });
  } catch (err: any) {
    console.error("[AI] generate error:", err);
    res.status(500).json({ error: err.message || "LLM request failed" });
  }
});
