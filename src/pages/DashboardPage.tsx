import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../data/templates';
import type { InvitationEvent, Guest } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<InvitationEvent[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: evts } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setEvents((evts as InvitationEvent[]) || []);

      if (evts && evts.length > 0) {
        const eventIds = evts.map((e) => e.id);
        const { data: gsts } = await supabase
          .from('guests')
          .select('*')
          .in('event_id', eventIds)
          .order('created_at', { ascending: false });
        setGuests((gsts as Guest[]) || []);
      }
      setLoading(false);
    })();
  }, [user]);

  const stats = {
    totalEvents: events.length,
    publishedEvents: events.filter((e) => e.status === 'published').length,
    totalGuests: guests.length,
    attending: guests.filter((g) => g.rsvp_status === 'attending').length,
    pending: guests.filter((g) => g.rsvp_status === 'pending').length,
    declined: guests.filter((g) => g.rsvp_status === 'declined').length,
  };

  const recentEvents = events.slice(0, 5);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500 h-10 w-10" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-cream-100">لوحة التحكم</h1>
        <p className="mt-2 text-sm text-cream-300/60">مرحباً بك — تابع دعواتك وردود الضيوف</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<CalendarDays className="h-6 w-6" />} label="إجمالي الدعوات" value={stats.totalEvents} />
        <StatCard icon={<Users className="h-6 w-6" />} label="إجمالي الضيوف" value={stats.totalGuests} />
        <StatCard icon={<CheckCircle className="h-6 w-6" />} label="سيحضرون" value={stats.attending} color="emerald" />
        <StatCard icon={<Clock className="h-6 w-6" />} label="بانتظار الرد" value={stats.pending} color="amber" />
      </div>

      {/* RSVP breakdown */}
      {stats.totalGuests > 0 && (
        <div className="mt-6 glass-card rounded-2xl p-6">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-lg text-cream-100">
            <TrendingUp className="h-5 w-5 text-gold-400" />
            إحصائيات الحضور
          </h3>
          <div className="space-y-3">
            <RSVPBar label="سيحضرون" count={stats.attending} total={stats.totalGuests} color="bg-emerald-500" />
            <RSVPBar label="بانتظار الرد" count={stats.pending} total={stats.totalGuests} color="bg-amber-500" />
            <RSVPBar label="اعتذروا" count={stats.declined} total={stats.totalGuests} color="bg-rose-500" />
          </div>
        </div>
      )}

      {/* Recent events */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-cream-100">أحدث الدعوات</h2>
          <Link
            to="/dashboard/events"
            className="flex items-center gap-1 text-sm text-gold-400 hover:underline"
          >
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-gold-500/40" />
            <h3 className="font-serif text-xl text-cream-100">لا توجد دعوات بعد</h3>
            <p className="mt-2 text-sm text-cream-300/50">
              اطلب دعوتك الأولى عبر واتساب، وبعد التأكيد ستظهر هنا
            </p>
            <button
              onClick={() => navigate('/templates')}
              className="btn-gold mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
            >
              <Plus className="h-4 w-4" />
              تصفح القوالب
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recentEvents.map((event) => {
              const template = getTemplate(event.template_id);
              const eventGuests = guests.filter((g) => g.event_id === event.id);
              const attending = eventGuests.filter((g) => g.rsvp_status === 'attending').length;
              return (
                <Link
                  key={event.id}
                  to={`/dashboard/events/${event.id}`}
                  className="glass-card group rounded-2xl p-5 transition-all hover:border-gold-500/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-cream-100 group-hover:text-gold-400 transition-colors">
                        {event.title || 'دعوة بدون عنوان'}
                      </h3>
                      <p className="mt-1 text-xs text-cream-300/50">
                        {event.event_date ? new Date(event.event_date).toLocaleDateString('ar-SY') : 'بدون تاريخ'}
                        {event.venue ? ` · ${event.venue}` : ''}
                      </p>
                    </div>
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

                  <div className="mt-4 flex items-center justify-between text-xs text-cream-300/50">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {eventGuests.length} ضيف
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {attending} سيحضر
                    </span>
                    {template && <span className="text-gold-400">{template.name}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
  color = 'gold',
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: 'gold' | 'emerald' | 'amber';
}) {
  const colors = {
    gold: 'bg-gold-500/10 text-gold-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
  };
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <div className="font-serif text-3xl font-semibold text-cream-100">{value}</div>
      <div className="mt-1 text-xs text-cream-300/50">{label}</div>
    </div>
  );
}

function RSVPBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-cream-300/70">{label}</span>
        <span className="text-cream-300/50">{count} / {total}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-navy-800">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
