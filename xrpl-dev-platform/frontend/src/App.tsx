import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import WalletPage from "./pages/WalletPage";
import PaymentPage from "./pages/PaymentPage";
import EscrowPage from "./pages/EscrowPage";
import QuickstartPage from "./pages/QuickstartPage";
import Sidebar from "./components/Sidebar";

type Page = "dashboard" | "wallet" | "payment" | "escrow" | "quickstart";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletSeed, setWalletSeed] = useState("");

  return (
    <div className="flex min-h-screen relative">
      <div className="app-bg" aria-hidden>
        <div className="app-bg-orb app-bg-orb-1" />
        <div className="app-bg-orb app-bg-orb-2" />
        <div className="app-bg-orb app-bg-orb-3" />
      </div>
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="flex-1 p-8 overflow-auto relative">
        {page === "dashboard" && (
          <Dashboard address={walletAddress} />
        )}
        {page === "wallet" && (
          <WalletPage
            address={walletAddress}
            seed={walletSeed}
            onWalletCreated={(addr, seed) => {
              setWalletAddress(addr);
              setWalletSeed(seed);
            }}
          />
        )}
        {page === "payment" && (
          <PaymentPage seed={walletSeed} address={walletAddress} />
        )}
        {page === "escrow" && (
          <EscrowPage seed={walletSeed} address={walletAddress} />
        )}
        {page === "quickstart" && (
          <QuickstartPage />
        )}
      </main>
    </div>
  );
}
