import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error === 'Invalid login credentials' ? 'البريد أو كلمة المرور غير صحيحة' : error);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4">
      <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold-500/8 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10">
            <Sparkles className="h-6 w-6 text-gold-400" />
          </div>
          <span className="font-serif text-2xl font-semibold text-cream-100">دعوات فاخرة</span>
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <h1 className="font-serif text-2xl font-semibold text-cream-100">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-cream-300/60">ادخل إلى حسابك لمتابعة طلباتك ودعواتك</p>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                <Mail className="h-4 w-4 text-gold-500/50" /> البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input-luxury w-full rounded-xl py-3 px-4 text-sm"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                <Lock className="h-4 w-4 text-gold-500/50" /> كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-luxury w-full rounded-xl py-3 px-4 pr-11 text-sm"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-300/40 hover:text-gold-400"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
              {!loading && <ArrowLeft className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cream-300/50">
            ليس لديك حساب؟{' '}
            <Link to="/signup" className="text-gold-400 hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </p>
        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-cream-300/50 hover:text-gold-400"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
