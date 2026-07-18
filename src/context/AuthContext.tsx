import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// 1. تحديث واجهة البيانات لإضافة خاصية isAdmin
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean; // الخاصية الجديدة لتحديد ما إذا كان المستخدم مديراً
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // 2. حالة جديدة لتخزين ما إذا كان المستخدم الحالي هو المدير أم لا
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // البريد الإلكتروني المخصص للمدير
  const ADMIN_EMAIL = 'alihatim760@gmail.com';

  useEffect(() => {
    // الفحص عند بدء تشغيل التطبيق وجلب الجلسة الحالية
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setSession(data.session);
      setUser(currentUser);
      
      // إذا كان المستخدم موجوداً وبريده يطابق بريد المدير، اجعل isAdmin تساوي true
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    // مراقبة التغييرات في حالة تسجيل الدخول أو الخروج
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      (async () => {
        const currentUser = sess?.user ?? null;
        setSession(sess);
        setUser(currentUser);
        
        // إعادة الفحص عند حدوث أي تغيير في حالة تسجيل الدخول
        if (currentUser && currentUser.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      })();
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
      });
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false); // إعادة تعيين صلاحية المدير إلى false عند تسجيل الخروج
  };

  // 3. تمرير قيمة isAdmin عبر الـ Provider لتصبح متاحة لكل صفحات الموقع
  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}