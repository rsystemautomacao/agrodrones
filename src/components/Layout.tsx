import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  Users,
  Cpu,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applications", label: "Aplicações", icon: FileText },
  { to: "/clients", label: "Clientes", icon: Users },
  { to: "/drones", label: "Drones", icon: Cpu },
  { to: "/operators", label: "Operadores", icon: Plane },
  { to: "/reports", label: "Relatórios", icon: BarChart3 },
  { to: "/settings", label: "Configurações", icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-agro-dark text-white shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Plane className="h-7 w-7 text-agro-green" />
            <span className="font-display text-xl font-bold">
              Agro<span className="text-agro-green">Drones</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-agro-green"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/30 text-sm hover:bg-white/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
            <button
              className="lg:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-white/10 px-4 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-agro-green"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-2 px-3 py-2.5 mt-2 rounded-md border border-white/30 text-sm text-white/80 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
