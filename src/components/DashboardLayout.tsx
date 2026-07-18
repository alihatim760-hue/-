import { type ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, LayoutDashboard, CalendarDays, LogOut, Home, Menu, X, Inbox } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/dashboard/events', label: 'دعواتي', icon: <CalendarDays className="h-5 w-5" /> },
    { path: '/dashboard/inquiries', label: 'الطلبات الواردة', icon: <Inbox className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Top bar (mobile) */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gold-500/10 bg-navy-900/95 px-4 py-3 backdrop-blur-lg md:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-400" />
          <span className="font-serif text-lg font-semibold text-cream-100">دعوات فاخرة</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-cream-300/70">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } fixed inset-y-0 right-0 z-30 w-64 border-l border-gold-500/10 bg-navy-950/95 p-5 backdrop-blur-lg md:block md:sticky md:top-0 md:h-screen`}
        >
          <div className="hidden md:block">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10">
                <Sparkles className="h-5 w-5 text-gold-400" />
              </div>
              <span className="font-serif text-xl font-semibold text-cream-100">دعوات فاخرة</span>
            </Link>
          </div>

          <nav className="mt-8 space-y-1">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                  isActive(link.path)
                    ? 'bg-gold-500/10 text-gold-400'
                    : 'text-cream-300/60 hover:bg-navy-800/50 hover:text-cream-100'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
            <Link
              to="/"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-cream-300/60 hover:bg-navy-800/50 hover:text-cream-100 transition-all"
            >
              <Home className="h-5 w-5" />
              الموقع الرئيسي
            </Link>
          </nav>

          <div className="absolute bottom-5 right-5 left-5">
            <div className="mb-3 rounded-xl border border-gold-500/10 bg-navy-800/50 p-3">
              <p className="truncate text-xs text-cream-300/50">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-400/80 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              تسجيل الخروج
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
