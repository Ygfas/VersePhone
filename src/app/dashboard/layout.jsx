"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FileText,
  Package,
  Newspaper,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  X,
  Check,
  LogOut,
} from "lucide-react";
import "../globals.css";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/invoice", label: "Invoice", icon: FileText },
  { href: "/dashboard/produk", label: "Produk", icon: Package },
  { href: "/dashboard/artikel", label: "Artikel", icon: Newspaper },
  { href: "/dashboard/laporan", label: "Laporan", icon: BarChart3 },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [unread, setUnread] = useState(0);
  const [user, setUser] = useState(null); // Menyimpan data admin
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Toggle menu avatar
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const prevCountRef = useRef(0);

  // Mengambil data session user yang sedang login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Gagal memuat sesi pengguna");
      }
    };
    fetchUser();
  }, []);

  // Poll for new transactions every 10 seconds
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/dashboard/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (data.length > prevCountRef.current) {
          const newOnes = data.slice(prevCountRef.current);
          setNotifications((prev) => [...newOnes, ...prev]);
          setUnread((u) => u + newOnes.length);
          prevCountRef.current = data.length;
        } else if (prevCountRef.current === 0 && data.length > 0) {
          setNotifications(data);
          prevCountRef.current = data.length;
        }
      } catch (_) {}
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown panels on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpenNotif = () => {
    setShowNotif((v) => !v);
    if (!showNotif) setUnread(0);
    setShowProfileMenu(false);
  };

  const handleOpenProfile = () => {
    setShowProfileMenu((v) => !v);
    setShowNotif(false);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <ShoppingCart size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-gray-900 text-sm tracking-tight whitespace-nowrap">
              VersePhone Admin
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!collapsed && <span className="font-medium">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              {navItems.find((n) =>
                n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href)
              )?.label ?? "Dashboard"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">VeersePhone Management</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleOpenNotif}
                className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-900">Notifikasi</span>
                    <button onClick={() => setShowNotif(false)}>
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">
                        Belum ada notifikasi
                      </p>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                          <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-green-50 flex items-center justify-center">
                            <Check size={13} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-800">
                              Transaksi baru: {n.kode_transaksi}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {n.nama} · {n.waktu_pembayaran}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar & Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={handleOpenProfile}
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:ring-2 hover:ring-gray-200 transition-all"
                title="Profile Menu"
              >
                <span className="text-white text-sm font-semibold uppercase">
                  {/* Ambil huruf pertama username, default ke "A" jika belum termuat */}
                  {user?.username ? user.username.charAt(0) : "A"}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.username || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "Memuat..."}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}