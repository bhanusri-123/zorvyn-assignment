import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_TRANSACTIONS_BASE = [
  { id: 1,  date: "2025-04-01", category: "Food",          description: "Swiggy Order",          amount: -850,   type: "expense", status: "completed" },
  { id: 2,  date: "2025-04-02", category: "Salary",        description: "Monthly Salary",         amount: 85000,  type: "income",  status: "completed" },
  { id: 3,  date: "2025-04-03", category: "Transport",     description: "Ola Cab",                amount: -320,   type: "expense", status: "completed" },
  { id: 4,  date: "2025-04-04", category: "Shopping",      description: "Amazon Purchase",        amount: -3200,  type: "expense", status: "completed" },
  { id: 5,  date: "2025-04-05", category: "Utilities",     description: "Electricity Bill",       amount: -1450,  type: "expense", status: "completed" },
  { id: 6,  date: "2025-04-06", category: "Food",          description: "Zomato Order",           amount: -620,   type: "expense", status: "completed" },
  { id: 7,  date: "2025-04-07", category: "Entertainment", description: "Netflix Subscription",   amount: -649,   type: "expense", status: "completed" },
  { id: 8,  date: "2025-04-08", category: "Health",        description: "Pharmacy",               amount: -890,   type: "expense", status: "completed" },
  { id: 9,  date: "2025-04-09", category: "Freelance",     description: "Design Project",         amount: 12000,  type: "income",  status: "completed" },
  { id: 10, date: "2025-04-10", category: "Transport",     description: "Petrol",                 amount: -2200,  type: "expense", status: "completed" },
  { id: 11, date: "2025-04-11", category: "Food",          description: "Grocery Store",          amount: -1800,  type: "expense", status: "completed" },
  { id: 12, date: "2025-04-12", category: "Shopping",      description: "Myntra Order",           amount: -2100,  type: "expense", status: "completed" },
  { id: 13, date: "2025-04-13", category: "Entertainment", description: "PVR Cinema",             amount: -750,   type: "expense", status: "completed" },
  { id: 14, date: "2025-04-14", category: "Savings",       description: "FD Deposit",             amount: -10000, type: "expense", status: "completed" },
  { id: 15, date: "2025-04-15", category: "Utilities",     description: "WiFi Bill",              amount: -799,   type: "expense", status: "pending"   },
  { id: 16, date: "2025-04-16", category: "Health",        description: "Gym Membership",         amount: -1200,  type: "expense", status: "completed" },
  { id: 17, date: "2025-04-17", category: "Food",          description: "Restaurant Dinner",      amount: -1500,  type: "expense", status: "completed" },
  { id: 18, date: "2025-04-18", category: "Freelance",     description: "Consulting Fee",         amount: 8000,   type: "income",  status: "completed" },
  { id: 19, date: "2025-04-19", category: "Shopping",      description: "Flipkart Electronics",   amount: -5400,  type: "expense", status: "failed"    },
  { id: 20, date: "2025-04-20", category: "Transport",     description: "Metro Card Recharge",    amount: -500,   type: "expense", status: "completed" },
];

const SPENDING_TREND = [
  { month: "Nov", income: 92000,  expenses: 38000, savings: 54000 },
  { month: "Dec", income: 97000,  expenses: 52000, savings: 45000 },
  { month: "Jan", income: 85000,  expenses: 41000, savings: 44000 },
  { month: "Feb", income: 85000,  expenses: 36000, savings: 49000 },
  { month: "Mar", income: 98000,  expenses: 47000, savings: 51000 },
  { month: "Apr", income: 105000, expenses: 43000, savings: 62000 },
];

const CATEGORY_COLORS = {
  Food: "#ec4899", Transport: "#06b6d4", Shopping: "#8b5cf6",
  Utilities: "#f59e0b", Entertainment: "#a855f7", Health: "#10b981",
  Savings: "#3b82f6", Freelance: "#22c55e", Salary: "#22c55e",
};
const CATEGORY_ICONS = {
  Food: "🍜", Transport: "🚗", Shopping: "🛍️",
  Utilities: "⚡", Entertainment: "🎬", Health: "💊",
  Savings: "💰", Freelance: "💼", Salary: "💼",
};

const formatINR = (n) => {
  const abs = Math.abs(n);
  if (abs >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (abs >= 1000)   return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
};
const formatINRFull = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// ─── LOCAL STORAGE ────────────────────────────────────────────────────────────
const LS_KEY = "zorvynTransactions";
const loadTransactions = () => {
  try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : MOCK_TRANSACTIONS_BASE; }
  catch { return MOCK_TRANSACTIONS_BASE; }
};
const saveTransactions = (d) => { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch {} };

// ─── SHIMMER ─────────────────────────────────────────────────────────────────
const Shimmer = ({ h = "h-4", rounded = "rounded" }) => (
  <div className={`w-full ${h} ${rounded} bg-gray-800 relative overflow-hidden`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
  </div>
);

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, title: "Salary Credited",      msg: "₹85,000 credited to your account",      time: "2h ago", icon: "💰", read: false },
  { id: 2, title: "High Spending Alert",  msg: "You've spent 40% more on shopping",      time: "5h ago", icon: "⚠️", read: false },
  { id: 3, title: "Bill Due",             msg: "WiFi bill of ₹799 is due today",         time: "1d ago", icon: "⚡", read: true  },
  { id: 4, title: "Savings Goal",         msg: "You're 78% towards your goal!",          time: "2d ago", icon: "🎯", read: true  },
];

const BOT_RESPONSES = {
  spend:   "Based on April data, you've spent ₹32,228. Top: Shopping (₹10,700), Food (₹4,770), Transport (₹3,020).",
  money:   "Income ₹1,05,000 | Expenses ₹43,228 | Savings ₹61,772. You're saving ~58.8% — excellent!",
  save:    "Tips: 1) Cut shopping (₹10.7K this month). 2) Cook at home. 3) Set up auto-SIP for mutual funds.",
  budget:  "Budget: Food 47% ✅ | Shopping 89% ⚠️ | Entertainment 71% | Transport 63%.",
  default: "Ask me: 'How much did I spend?', 'Where did my money go?', or 'How can I save more?'",
};
const getBotReply = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes("spend") || m.includes("spent") || m.includes("much")) return BOT_RESPONSES.spend;
  if (m.includes("money") || m.includes("go")    || m.includes("where")) return BOT_RESPONSES.money;
  if (m.includes("save")  || m.includes("saving") || m.includes("tip"))  return BOT_RESPONSES.save;
  if (m.includes("budget")) return BOT_RESPONSES.budget;
  return BOT_RESPONSES.default;
};

// ─── CUSTOM CHART TOOLTIP ────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl text-sm">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {formatINR(p.value)}</p>
      ))}
    </div>
  );
};

// ─── PIE LEGEND ──────────────────────────────────────────────────────────────
const PieLegendGrid = ({ pieData, totalExp }) => (
  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3 px-1">
    {pieData.map((d, i) => (
      <div key={i} className="flex items-center gap-1.5 min-w-0">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[d.name] || "#6366f1" }} />
        <span className="text-xs text-gray-300 truncate">
          {d.name} <span className="font-semibold text-white">{((d.value / totalExp) * 100).toFixed(0)}%</span>
        </span>
      </div>
    ))}
  </div>
);

// ─── THEME PRESETS ────────────────────────────────────────────────────────────
// brightness value is a CSS filter applied to the root wrapper
const BRIGHTNESS_LEVELS = [
  { label: "Dim",     value: 0.7  },
  { label: "Normal",  value: 1.0  },
  { label: "Bright",  value: 1.25 },
];

// ═════════════════════════════════════════════════════════════════════════════
export default function FinanceDashboard() {
  const [role,               setRole]               = useState("admin");
  const [activeNav,          setActiveNav]          = useState("dashboard");
  const [transactions,       setTransactions]       = useState(loadTransactions);
  const [loading,            setLoading]            = useState(true);
  const [showNotif,          setShowNotif]          = useState(false);
  const [showChat,           setShowChat]           = useState(false);
  const [chatMessages,       setChatMessages]       = useState([
    { from: "bot", text: "Hi! I'm your AI finance assistant 👋 Ask me anything about your finances!" }
  ]);
  const [chatInput,          setChatInput]          = useState("");
  const [filterCategory,     setFilterCategory]     = useState("All");
  const [filterType,         setFilterType]         = useState("All");
  const [searchQuery,        setSearchQuery]        = useState("");
  const [sortField,          setSortField]          = useState("date");
  const [sortDir,            setSortDir]            = useState("desc");
  const [showAddModal,       setShowAddModal]       = useState(false);
  const [sidebarOpen,        setSidebarOpen]        = useState(true);
  const [mobileSidebarOpen,  setMobileSidebarOpen]  = useState(false);
  const [brightness,         setBrightness]         = useState(1.0);
  const [newTxn,             setNewTxn]             = useState({ date: "", category: "Food", description: "", amount: "", type: "expense" });
  const [notifications,      setNotifications]      = useState(NOTIFICATIONS);

  const notifRef   = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1400); return () => clearTimeout(t); }, []);
  useEffect(() => { saveTransactions(transactions); }, [transactions]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);
  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const income   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = Math.abs(transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0));
  const balance  = income - expenses;
  const savings  = income - expenses;

  const catTotals = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + Math.abs(t.amount);
  });
  const pieData  = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  const totalExp = pieData.reduce((s, d) => s + d.value, 0);

  const topCat = pieData[0];
  const insights = [
    { icon: "🍜", text: `Highest spending: ${topCat?.name} (${formatINR(topCat?.value || 0)})`,     color: "text-amber-400"  },
    { icon: "📈", text: `Savings rate: ${((savings / income) * 100).toFixed(1)}% — Keep it up!`,    color: "text-emerald-400" },
    { icon: "⚠️", text: "Shopping spend is 89% of budget — consider reducing",                       color: "text-rose-400"   },
    { icon: "💡", text: "Income increased 7.1% vs last month",                                       color: "text-blue-400"   },
  ];

  const categories    = ["All", ...Array.from(new Set(transactions.map(t => t.category)))];
  const filteredTxns  = transactions
    .filter(t => filterCategory === "All" || t.category === filterCategory)
    .filter(t => filterType     === "All" || t.type     === filterType)
    .filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 t.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === "amount") { av = Math.abs(av); bv = Math.abs(bv); }
      return av < bv ? (sortDir === "asc" ? -1 : 1) : av > bv ? (sortDir === "asc" ? 1 : -1) : 0;
    });

  const addTransaction = () => {
    if (!newTxn.date || !newTxn.description || !newTxn.amount) return;
    const amt = newTxn.type === "expense" ? -Math.abs(Number(newTxn.amount)) : Math.abs(Number(newTxn.amount));
    setTransactions(prev => [{ ...newTxn, id: Date.now(), amount: amt, status: "completed" }, ...prev]);
    setNewTxn({ date: "", category: "Food", description: "", amount: "", type: "expense" });
    setShowAddModal(false);
  };

  const exportCSV = () => {
    const rows = [["Date","Description","Category","Amount","Type","Status"]];
    filteredTxns.forEach(t => rows.push([`"${t.date}"`,`"${t.description}"`,t.category,t.amount,t.type,t.status]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "zorvyn_transactions.csv"; a.click();
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredTxns, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "zorvyn_transactions.json"; a.click();
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { from: "user", text: chatInput };
    setChatMessages(p => [...p, userMsg]);
    setChatInput("");
    setTimeout(() => setChatMessages(p => [...p, { from: "bot", text: getBotReply(userMsg.text) }]), 700);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: "dashboard",    icon: "⊞", label: "Dashboard"    },
    { id: "transactions", icon: "↕", label: "Transactions" },
    { id: "analytics",    icon: "◑", label: "Analytics"    },
    { id: "settings",     icon: "⚙", label: "Settings"     },
  ];

  // ── Mobile nav links ───────────────────────────────────────────────────────
  const MobileNavLinks = ({ onItemClick }) => (
    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
      {navItems.map(item => (
        <button key={item.id}
          onClick={() => { setActiveNav(item.id); onItemClick?.(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            ${activeNav === item.id ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
          <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div
      className="flex h-screen bg-gray-950 text-white overflow-hidden"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", filter: `brightness(${brightness})` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        .card-hover { transition: all .22s cubic-bezier(.4,0,.2,1); }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(0,0,0,.45); }
        .fade-up  { animation: fadeUp .4s ease both; }
        .fade-in  { animation: fadeIn .22s ease both; }
        .scrollbar-thin::-webkit-scrollbar       { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #0f172a; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .brightness-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: #6366f1; cursor: pointer;
        }
        .brightness-slider { -webkit-appearance: none; height: 4px; border-radius: 4px; outline: none; cursor: pointer; }
      `}</style>

      {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 bg-gray-900 border-r border-gray-800 z-20"
        style={{
          width: sidebarOpen ? 220 : 56,
          minWidth: sidebarOpen ? 220 : 56,
          transition: "width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center border-b border-gray-800 flex-shrink-0"
          style={{ padding: sidebarOpen ? "0 12px" : "0", justifyContent: sidebarOpen ? "flex-start" : "center" }}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">Z</div>
          {sidebarOpen && <span className="ml-3 font-bold text-white text-lg whitespace-nowrap">Zorvyn</span>}
        </div>

        {/* Role switcher — only when open */}
        {sidebarOpen && (
          <div className="px-3 py-3 border-b border-gray-800 flex-shrink-0">
            <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Role</p>
            <select value={role} onChange={e => setRole(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer">
              <option value="admin">👑 Admin</option>
              <option value="viewer">👁 Viewer</option>
            </select>
            <p className="text-xs text-gray-600 mt-1.5">{role === "admin" ? "Can add & edit" : "View only mode"}</p>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin"
          style={{ padding: sidebarOpen ? "16px 8px" : "16px 6px" }}>
          {navItems.map(item => (
            <button key={item.id}
              title={!sidebarOpen ? item.label : undefined}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center rounded-xl text-sm font-medium transition-all
                ${activeNav === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              style={{
                height: 40,
                justifyContent: sidebarOpen ? "flex-start" : "center",
                padding: sidebarOpen ? "0 10px" : "0",
                gap: sidebarOpen ? 10 : 0,
              }}
            >
              <span className="text-base flex-shrink-0" style={{ width: 20, textAlign: "center" }}>{item.icon}</span>
              {sidebarOpen && (
                <span className="whitespace-nowrap overflow-hidden" style={{ opacity: 1 }}>{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-gray-800 flex-shrink-0 p-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
            <span className="text-sm select-none">{sidebarOpen ? "◂" : "▸"}</span>
          </button>
        </div>
      </aside>

      {/* ══ MOBILE SIDEBAR DRAWER ════════════════════════════════════════════ */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60 bg-gray-900 border-r border-gray-800 flex flex-col fade-in">
            <div className="h-16 flex items-center px-4 border-b border-gray-800 gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">Z</div>
              <span className="font-bold text-white text-lg">Zorvyn</span>
            </div>
            <div className="px-3 py-3 border-b border-gray-800">
              <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Role</p>
              <select value={role} onChange={e => setRole(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none">
                <option value="admin">👑 Admin</option>
                <option value="viewer">👁 Viewer</option>
              </select>
            </div>
            <MobileNavLinks onItemClick={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ══ MAIN CONTENT ═════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* TOPBAR */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 flex-shrink-0 z-30">
          <button className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex-shrink-0"
            onClick={() => setMobileSidebarOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotif(!showNotif)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors">
                <span className="text-base">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 rounded-full text-white font-bold flex items-center justify-center"
                    style={{ width: 17, height: 17, fontSize: 10 }}>{unreadCount}</span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[9999] fade-in overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-white text-sm">Notifications</h3>
                    <button onClick={() => setNotifications(p => p.map(n => ({ ...n, read: true })))}
                      className="text-xs text-indigo-400 hover:text-indigo-300">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto scrollbar-thin">
                    {notifications.map(n => (
                      <div key={n.id}
                        onClick={() => setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
                        className={`px-4 py-3 flex gap-3 hover:bg-gray-800 cursor-pointer transition-colors ${!n.read ? "bg-gray-800/50" : ""}`}>
                        <span className="text-xl flex-shrink-0">{n.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white flex items-center gap-2">
                            {n.title}{!n.read && <span className="w-2 h-2 bg-indigo-500 rounded-full inline-block" />}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{n.msg}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-2.5 py-1.5 cursor-pointer hover:border-gray-600 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">BS</div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white leading-tight">Bhanusri</p>
                <p className="text-xs text-gray-500 leading-tight capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-4 lg:p-5">

          {/* ════ DASHBOARD ════ */}
          {activeNav === "dashboard" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">Financial Overview</h1>
                  <p className="text-xs sm:text-sm text-gray-500">April 2025 · Updated just now</p>
                </div>
                {role === "admin" && (
                  <button onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors shadow-lg shadow-indigo-900/40">
                    + Add Transaction
                  </button>
                )}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {loading ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
                    <Shimmer h="h-3" /><Shimmer h="h-7" /><Shimmer h="h-3" />
                  </div>
                )) : [
                  { label: "Total Balance",  value: balance,  icon: "💎", trend: "+8.2%", up: true,  from: "from-indigo-600/20", border: "border-indigo-800/40"  },
                  { label: "Total Income",   value: income,   icon: "📈", trend: "+7.1%", up: true,  from: "from-emerald-600/20",border: "border-emerald-800/40" },
                  { label: "Total Expenses", value: expenses, icon: "📉", trend: "-3.4%", up: false, from: "from-rose-600/20",   border: "border-rose-800/40"    },
                  { label: "Total Savings",  value: savings,  icon: "🏦", trend: "+12%",  up: true,  from: "from-amber-600/20",  border: "border-amber-800/40"   },
                ].map((card, i) => (
                  <div key={i}
                    className={`card-hover bg-gradient-to-br ${card.from} to-gray-900/5 border ${card.border} rounded-2xl p-4 fade-up`}
                    style={{ animationDelay: `${i * 70}ms` }}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-tight">{card.label}</p>
                      <span className="text-xl">{card.icon}</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-white mb-1.5">{formatINR(card.value)}</p>
                    <p className={`text-xs font-semibold flex items-center gap-1 ${card.up ? "text-emerald-400" : "text-rose-400"}`}>
                      <span>{card.up ? "▲" : "▼"}</span>{card.trend} vs last month
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-white text-sm">Spending Trends</h2>
                    <span className="text-xs text-gray-500">Last 6 months</span>
                  </div>
                  {loading ? <Shimmer h="h-48" rounded="rounded-xl" /> : (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={SPENDING_TREND}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatINR} width={52} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
                        <Line type="monotone" dataKey="income"   stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Income"   />
                        <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Expenses" />
                        <Line type="monotone" dataKey="savings"  stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Savings"  />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Pie chart */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <h2 className="font-semibold text-white text-sm">Expense Breakdown</h2>
                  <p className="text-xs text-gray-500 mb-1">By category this month</p>
                  {loading ? <Shimmer h="h-48" rounded="rounded-xl" /> : (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={2} dataKey="value" strokeWidth={0}>
                            {pieData.map((entry, i) => (
                              <Cell key={i} fill={CATEGORY_COLORS[entry.name] || "#6366f1"} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(v, name) => [`${formatINR(v)} · ${((v / totalExp) * 100).toFixed(1)}%`, name]}
                            contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 10, fontSize: 12 }}
                            itemStyle={{ color: "#fff" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <PieLegendGrid pieData={pieData} totalExp={totalExp} />
                    </>
                  )}
                </div>
              </div>

              {/* Bar + Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <h2 className="font-semibold text-white text-sm mb-3">Monthly Comparison</h2>
                  {loading ? <Shimmer h="h-44" rounded="rounded-xl" /> : (
                    <ResponsiveContainer width="100%" height={175}>
                      <BarChart data={SPENDING_TREND} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatINR} width={52} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
                        <Bar dataKey="income"   fill="#6366f1" radius={[4,4,0,0]} name="Income"   maxBarSize={28} />
                        <Bar dataKey="expenses" fill="#f43f5e" radius={[4,4,0,0]} name="Expenses" maxBarSize={28} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <h2 className="font-semibold text-white text-sm mb-3">💡 Smart Insights</h2>
                  <div className="space-y-2.5">
                    {insights.map((ins, i) => (
                      <div key={i} className="card-hover flex items-start gap-3 bg-gray-800/60 rounded-xl p-3 border border-gray-700/50">
                        <span className="text-lg flex-shrink-0">{ins.icon}</span>
                        <p className={`text-xs leading-relaxed ${ins.color}`}>{ins.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-white text-sm">Recent Transactions</h2>
                  <button onClick={() => setActiveNav("transactions")} className="text-xs text-indigo-400 hover:text-indigo-300">View all →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[460px]">
                    <thead>
                      <tr className="border-b border-gray-800">
                        {["Date","Description","Category","Amount","Status"].map(h => (
                          <th key={h} className="text-left text-xs text-gray-500 font-medium pb-2 pr-4 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map(t => (
                        <tr key={t.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                          <td className="py-2.5 pr-4 text-xs text-gray-400">{t.date}</td>
                          <td className="py-2.5 pr-4 text-xs text-white font-medium">{t.description}</td>
                          <td className="py-2.5 pr-4">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">{CATEGORY_ICONS[t.category]} {t.category}</span>
                          </td>
                          <td className={`py-2.5 pr-4 text-xs font-bold ${t.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {t.amount > 0 ? "+" : ""}{formatINR(t.amount)}
                          </td>
                          <td className="py-2.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                              ${t.status === "completed" ? "bg-emerald-900/40 text-emerald-400" :
                                t.status === "pending"   ? "bg-amber-900/40  text-amber-400"   : "bg-rose-900/40 text-rose-400"}`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ TRANSACTIONS ════ */}
          {activeNav === "transactions" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">Transactions</h1>
                  <p className="text-xs sm:text-sm text-gray-500">{filteredTxns.length} records</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role === "admin" && (
                    <button onClick={() => setShowAddModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-2 rounded-xl transition-colors">+ Add</button>
                  )}
                  <button onClick={exportCSV}  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-xl border border-gray-700 transition-colors">↓ CSV</button>
                  <button onClick={exportJSON} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-xl border border-gray-700 transition-colors">↓ JSON</button>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500 font-medium">Filter:</span>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500">
                  {["All","income","expense"].map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={sortField} onChange={e => setSortField(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500">
                  <option value="date">Sort: Date</option>
                  <option value="amount">Sort: Amount</option>
                  <option value="category">Sort: Category</option>
                </select>
                <button onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white hover:bg-gray-700 transition-colors">
                  {sortDir === "asc" ? "↑ Asc" : "↓ Desc"}
                </button>
                {(filterCategory !== "All" || filterType !== "All" || searchQuery) && (
                  <button onClick={() => { setFilterCategory("All"); setFilterType("All"); setSearchQuery(""); }}
                    className="text-xs text-rose-400 hover:text-rose-300">✕ Clear</button>
                )}
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px]">
                    <thead className="bg-gray-800/50">
                      <tr>
                        {["Date","Description","Category","Type","Amount","Status",...(role==="admin"?["Actions"]:[])].map(h => (
                          <th key={h} className="text-left text-xs text-gray-500 font-semibold px-4 py-3 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTxns.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl">📭</span>
                            <p className="text-gray-400 text-sm">No transactions found</p>
                            <p className="text-gray-600 text-xs">Try adjusting your filters</p>
                          </div>
                        </td></tr>
                      ) : filteredTxns.map(t => (
                        <tr key={t.id} className="border-t border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 text-xs text-gray-400">{t.date}</td>
                          <td className="px-4 py-3 text-xs text-white font-medium">{t.description}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">{CATEGORY_ICONS[t.category]} {t.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${t.type === "income" ? "bg-emerald-900/30 text-emerald-400" : "bg-rose-900/30 text-rose-400"}`}>{t.type}</span>
                          </td>
                          <td className={`px-4 py-3 text-xs font-bold ${t.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {t.amount > 0 ? "+" : ""}{formatINRFull(t.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                              ${t.status === "completed" ? "bg-emerald-900/40 text-emerald-400" :
                                t.status === "pending"   ? "bg-amber-900/40  text-amber-400"   : "bg-rose-900/40 text-rose-400"}`}>
                              {t.status}
                            </span>
                          </td>
                          {role === "admin" && (
                            <td className="px-4 py-3">
                              <button onClick={() => setTransactions(p => p.filter(x => x.id !== t.id))}
                                className="text-xs text-rose-400 hover:text-rose-300 transition-colors">Delete</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ ANALYTICS ════ */}
          {activeNav === "analytics" && (
            <div className="space-y-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Analytics</h1>
                <p className="text-xs sm:text-sm text-gray-500">Deep dive into your spending patterns</p>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {[
                  { label: "Avg Monthly Spend", value: formatINR(expenses), icon: "📊", sub: "this month" },
                  { label: "Savings Rate", value: `${((savings/income)*100).toFixed(1)}%`, icon: "💹", sub: "of income" },
                  { label: "Biggest Expense", value: formatINR(Math.max(...transactions.filter(t=>t.type==="expense").map(t=>Math.abs(t.amount)))), icon: "🎯", sub: "single transaction" },
                  { label: "Total Txns", value: transactions.length, icon: "📋", sub: "this month" },
                ].map((k,i) => (
                  <div key={i} className="card-hover bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide leading-tight">{k.label}</p>
                      <span className="text-xl">{k.icon}</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-white">{k.value}</p>
                    <p className="text-xs text-gray-600 mt-1">{k.sub}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <h2 className="font-semibold text-white text-sm mb-4">Category Breakdown</h2>
                  <div className="space-y-3">
                    {pieData.slice(0,7).map((d,i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-300">{CATEGORY_ICONS[d.name]} {d.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{formatINR(d.value)}</span>
                            <span className="text-xs font-bold text-white w-10 text-right">{((d.value/totalExp)*100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all duration-700"
                            style={{ width:`${(d.value/totalExp)*100}%`, background: CATEGORY_COLORS[d.name]||"#6366f1" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <h2 className="font-semibold text-white text-sm mb-4">6-Month Savings Trend</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={SPENDING_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatINR} width={52} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="savings" fill="#10b981" radius={[4,4,0,0]} name="Savings" maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <h2 className="font-semibold text-white text-sm mb-3">📊 Detailed Insights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon:"🍜", title:"Food & Delivery",     text:`Spent ${formatINR(catTotals["Food"]||0)} on food — ${((catTotals["Food"]||0)/income*100).toFixed(1)}% of income.`, color:"border-l-amber-500" },
                    { icon:"🛍️", title:"Shopping Alert",      text:`Shopping ${formatINR(catTotals["Shopping"]||0)} is 89% of budget.`,                                                  color:"border-l-rose-500" },
                    { icon:"💰", title:"Savings Achievement", text:`Saving ${formatINR(savings)} — a great ${((savings/income)*100).toFixed(1)}% rate!`,                                color:"border-l-emerald-500" },
                    { icon:"📈", title:"Income Growth",       text:"Income grew 7.1% vs last month. Keep diversifying sources.",                                                          color:"border-l-indigo-500" },
                  ].map((ins,i) => (
                    <div key={i} className={`bg-gray-800/50 border border-gray-700/50 border-l-4 ${ins.color} rounded-xl p-3`}>
                      <div className="flex items-center gap-2 mb-1"><span>{ins.icon}</span><span className="text-sm font-semibold text-white">{ins.title}</span></div>
                      <p className="text-xs text-gray-400 leading-relaxed">{ins.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ SETTINGS ════ */}
          {activeNav === "settings" && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Settings</h1>
                <p className="text-xs sm:text-sm text-gray-500">Manage your preferences</p>
              </div>

              {/* ── THEME BRIGHTNESS ── */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Theme Brightness</p>
                    <p className="text-xs text-gray-500 mt-0.5">Adjust the display brightness to your comfort</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-900/30 border border-indigo-800/40 px-2.5 py-1 rounded-lg">
                    {brightness === 0.7 ? "🌑 Dim" : brightness === 1.0 ? "🌕 Normal" : "☀️ Bright"}
                  </span>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0.5} max={1.4} step={0.05}
                    value={brightness}
                    onChange={e => setBrightness(Number(e.target.value))}
                    className="brightness-slider w-full"
                    style={{
                      background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((brightness-0.5)/0.9)*100}%, #374151 ${((brightness-0.5)/0.9)*100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Darker</span>
                    <span className="text-gray-400 font-medium">{Math.round(brightness * 100)}%</span>
                    <span>Brighter</span>
                  </div>
                </div>

                {/* Quick preset buttons */}
                <div className="flex gap-2 mt-3">
                  {BRIGHTNESS_LEVELS.map(lvl => (
                    <button key={lvl.label}
                      onClick={() => setBrightness(lvl.value)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border
                        ${brightness === lvl.value
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}>
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other settings */}
              {[
                { title: "Current Role", desc: "Switch between Admin and Viewer roles", el: (
                  <select value={role} onChange={e => setRole(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                )},
                { title: "Export Data", desc: "Download your transaction data", el: (
                  <div className="flex gap-2">
                    <button onClick={exportCSV}  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-2 rounded-xl transition-colors">CSV</button>
                    <button onClick={exportJSON} className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded-xl transition-colors">JSON</button>
                  </div>
                )},
                { title: "Reset Data", desc: "Clear all data and restore defaults", el: (
                  <button onClick={() => { setTransactions(MOCK_TRANSACTIONS_BASE); saveTransactions(MOCK_TRANSACTIONS_BASE); }}
                    className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-800/50 text-sm px-3 py-2 rounded-xl transition-colors">
                    Reset defaults
                  </button>
                )},
              ].map((s,i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  </div>
                  {s.el}
                </div>
              ))}

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-sm font-semibold text-white mb-1">About</p>
                <p className="text-xs text-gray-500">Zorvyn v1.0.0 — Finance Dashboard</p>
                <p className="text-xs text-gray-600 mt-1">Data is stored locally in your browser. Nothing sent to any server.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── ADD TRANSACTION MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9998] p-4 fade-in">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Add Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white text-xl">×</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                <input type="date" value={newTxn.date} onChange={e => setNewTxn(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <input type="text" placeholder="e.g. Swiggy Order" value={newTxn.description}
                  onChange={e => setNewTxn(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Category</label>
                  <select value={newTxn.category} onChange={e => setNewTxn(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    {Object.keys(CATEGORY_ICONS).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <select value={newTxn.type} onChange={e => setNewTxn(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Amount (₹)</label>
                <input type="number" placeholder="0" value={newTxn.amount}
                  onChange={e => setNewTxn(p => ({ ...p, amount: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={addTransaction}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2.5 rounded-xl transition-colors font-medium">Add Transaction</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAT BUTTON ── */}
      <button onClick={() => setShowChat(!showChat)}
        className="fixed bottom-5 right-5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl shadow-indigo-900/60 flex items-center justify-center text-white text-xl hover:scale-110 transition-transform z-[9990]"
        style={{ width: 50, height: 50 }}>
        {showChat ? "✕" : "💬"}
      </button>

      {/* ── CHAT PANEL ── */}
      {showChat && (
        <div className="fixed bottom-20 right-4 sm:right-5 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[9990] flex flex-col overflow-hidden fade-in"
          style={{ height: 400 }}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">🤖</div>
            <div>
              <p className="text-sm font-semibold text-white">AI Finance Assistant</p>
              <p className="text-xs text-indigo-200">Always online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2.5">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed
                  ${m.from === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-gray-800 text-gray-200 rounded-bl-sm border border-gray-700"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
            {["How much did I spend?", "Save more tips", "Budget status"].map(s => (
              <button key={s} onClick={() => setChatInput(s)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 px-2 py-1 rounded-lg border border-gray-700 transition-colors">{s}</button>
            ))}
          </div>
          <div className="p-3 pt-0 flex gap-2 flex-shrink-0">
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Ask something..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            <button onClick={sendChat}
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white transition-colors flex-shrink-0">↑</button>
          </div>
        </div>
      )}
    </div>
  );
}
