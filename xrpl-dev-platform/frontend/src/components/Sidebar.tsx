type Page = "dashboard" | "wallet" | "payment" | "escrow" | "quickstart";

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: "dashboard", label: "Dashboard", icon: "\u{1F4CA}" },
  { page: "wallet", label: "Wallet", icon: "\u{1F45B}" },
  { page: "payment", label: "Payments", icon: "\u{1F4B8}" },
  { page: "escrow", label: "Escrow", icon: "\u{1F512}" },
  { page: "quickstart", label: "Dev Quickstart", icon: "\u{1F680}" },
];

export default function Sidebar({ currentPage, onNavigate }: Props) {
  return (
    <aside className="w-64 glass border-r border-white/[0.06] p-6 flex flex-col shrink-0">
      <h1 className="text-xl font-bold text-xrpl-accent mb-1">XRPL Dev Platform</h1>
      <p className="text-xs text-white/50 mb-8">Testnet</p>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === item.page
                ? "bg-xrpl-accent/20 text-xrpl-accent border border-xrpl-accent/30"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white border border-transparent"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
