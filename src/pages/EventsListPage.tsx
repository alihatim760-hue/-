import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Plus, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../data/templates';
import type { InvitationEvent } from '../types';

export default function EventsListPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<InvitationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setEvents((data as InvitationEvent[]) || []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-cream-100">دعواتي</h1>
          <p className="mt-2 text-sm text-cream-300/60">جميع دعواتك في مكان واحد</p>
        </div>
        <Link
          to="/templates"
          className="btn-gold flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          دعوة جديدة
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500 h-10 w-10" />
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-gold-500/40" />
          <h3 className="font-serif text-xl text-cream-100">لا توجد دعوات بعد</h3>
          <p className="mt-2 text-sm text-cream-300/50">
            اطلب دعوتك الأولى عبر واتساب، وبعد التأكيد ستظهر هنا
          </p>
          <Link
            to="/templates"
            className="btn-gold mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
          >
            <Plus className="h-4 w-4" />
            تصفح القوالب
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const template = getTemplate(event.template_id);
            return (
              <Link
                key={event.id}
                to={`/dashboard/events/${event.id}`}
                className="glass-card group rounded-2xl p-5 transition-all hover:border-gold-500/30"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-serif text-lg font-semibold text-cream-100 group-hover:text-gold-400 transition-colors">
                    {event.title || 'دعوة بدون عنوان'}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      event.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    {event.status === 'published' ? 'منشورة' : 'مسودة'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-cream-300/50">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-gold-500/50" />
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString('ar-SY', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'بدون تاريخ'}
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-2">
                      <span className="text-gold-500/50">●</span>
                      {event.venue}
                    </div>
                  )}
                  {template && (
                    <div className="flex items-center gap-2 text-gold-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      {template.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
