import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { path: '/templates', label: 'القوالب' },
    { path: '/pricing', label: 'الأسعار' },
    { path: '/how-it-works', label: 'كيف نعمل' },
    { path: '/contact', label: 'تواصل معنا' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-lg border-b border-gold-500/10 py-3'
          : 'py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10">
            <Sparkles className="h-5 w-5 text-gold-400" />
          </div>
          <span className="font-serif text-xl font-semibold text-cream-100">دعوات فاخرة</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`text-sm transition-colors ${
                isActive(link.path)
                  ? 'text-gold-400'
                  : 'text-cream-300/70 hover:text-gold-400'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded-xl border border-gold-500/30 px-4 py-2 text-sm text-gold-400 hover:bg-gold-500/10 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              لوحة التحكم
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 rounded-xl border border-gold-500/30 px-4 py-2 text-sm text-gold-400 hover:bg-gold-500/10 transition-all"
            >
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </button>
          )}
          <button
            onClick={() => navigate('/order')}
            className="btn-gold rounded-xl px-5 py-2.5 text-sm"
          >
            اطلب دعوتك
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-cream-300/70 md:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="mt-3 border-t border-gold-500/10 bg-navy-900/95 px-4 py-4 md:hidden">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`block w-full py-3 text-right text-sm ${
                isActive(link.path) ? 'text-gold-400' : 'text-cream-300/70'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex w-full items-center gap-2 py-3 text-sm text-gold-400"
            >
              <LayoutDashboard className="h-4 w-4" />
              لوحة التحكم
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex w-full items-center gap-2 py-3 text-sm text-gold-400"
            >
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </button>
          )}
          <button
            onClick={() => navigate('/order')}
            className="btn-gold mt-2 w-full rounded-xl py-3 text-sm"
          >
            اطلب دعوتك
          </button>
        </div>
      )}
    </nav>
  );
}
