type Page = "dashboard" | "wallet" | "payment" | "escrow";

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: "dashboard", label: "Dashboard", icon: "📊" },
  { page: "wallet", label: "Wallet", icon: "👛" },
  { page: "payment", label: "Payments", icon: "💸" },
  { page: "escrow", label: "Escrow", icon: "🔒" },
];

export default function Sidebar({ currentPage, onNavigate }: Props) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
      <h1 className="text-xl font-bold text-xrpl-accent mb-1">XRPL Dev Platform</h1>
      <p className="text-xs text-gray-500 mb-8">Testnet</p>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === item.page
                ? "bg-xrpl-blue text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
