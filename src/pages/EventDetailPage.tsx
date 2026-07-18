import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  Share2,
  Copy,
  Check,
  Edit3,
  Sparkles,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../data/templates';
import { PRICING_PACKAGES, formatPrice, type InvitationEvent, type Guest } from '../types';


export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<InvitationEvent | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', host_name: '', venue: '', event_date: '', event_time: '' });

  useEffect(() => {
    (async () => {
      if (!id || !user) return;
      const { data: evt } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (evt) {
        setEvent(evt as InvitationEvent);
        setEditForm({
          title: (evt as InvitationEvent).title || '',
          host_name: (evt as InvitationEvent).host_name || '',
          venue: (evt as InvitationEvent).venue || '',
          event_date: (evt as InvitationEvent).event_date || '',
          event_time: (evt as InvitationEvent).event_time || '',
        });
      }
      const { data: gsts } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false });
      setGuests((gsts as Guest[]) || []);
      setLoading(false);
    })();
  }, [id, user]);

  const stats = {
    total: guests.length,
    attending: guests.filter((g) => g.rsvp_status === 'attending').length,
    pending: guests.filter((g) => g.rsvp_status === 'pending').length,
    declined: guests.filter((g) => g.rsvp_status === 'declined').length,
    maybe: guests.filter((g) => g.rsvp_status === 'maybe').length,
  };

  const invitationUrl = event?.invitation_slug
    ? `${window.location.origin}/invite/${event.invitation_slug}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = async () => {
    if (!event || !user) return;
    let slug = event.invitation_slug;
    if (!slug) {
      slug = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
    }
    const { data, error } = await supabase
      .from('events')
      .update({ status: 'published', invitation_slug: slug })
      .eq('id', event.id)
      .eq('user_id', user.id)
      .select('*')
      .maybeSingle();
    if (!error && data) setEvent(data as InvitationEvent);
  };

  const handleSaveEdit = async () => {
    if (!event || !user) return;
    const { data, error } = await supabase
      .from('events')
      .update({
        title: editForm.title,
        host_name: editForm.host_name,
        venue: editForm.venue,
        event_date: editForm.event_date || null,
        event_time: editForm.event_time,
      })
      .eq('id', event.id)
      .eq('user_id', user.id)
      .select('*')
      .maybeSingle();
    if (!error && data) {
      setEvent(data as InvitationEvent);
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !user) return;
    if (!confirm('هل أنت متأكد من حذف هذه الدعوة؟ سيتم حذف جميع بيانات الضيوف أيضاً.')) return;
    await supabase.from('events').delete().eq('id', event.id).eq('user_id', user.id);
    navigate('/dashboard/events');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500 h-10 w-10" />
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="flex h-96 flex-col items-center justify-center text-center">
          <Sparkles className="mb-4 h-12 w-12 text-gold-500/40" />
          <h2 className="font-serif text-2xl text-cream-100">الدعوة غير موجودة</h2>
          <button onClick={() => navigate('/dashboard/events')} className="btn-outline-gold mt-6 rounded-xl px-6 py-3 text-sm">
            العودة لدعواتي
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const template = getTemplate(event.template_id);
  const pkg = PRICING_PACKAGES.find((p) => p.id === event.package_type);

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate('/dashboard/events')}
        className="mb-6 flex items-center gap-2 text-sm text-cream-300/60 hover:text-gold-400 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        العودة لدعواتي
      </button>

      {/* Header */}
      <div className="glass-card mb-6 rounded-2xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            {editing ? (
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="input-luxury mb-2 w-full rounded-xl px-4 py-2 text-lg"
                placeholder="عنوان الدعوة"
              />
            ) : (
              <h1 className="font-serif text-3xl font-semibold text-cream-100">
                {event.title || 'دعوة بدون عنوان'}
              </h1>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-cream-300/50">
              <span
                className={`rounded-full px-2.5 py-1 text-xs ${
                  event.status === 'published'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-amber-500/15 text-amber-400'
                }`}
              >
                {event.status === 'published' ? 'منشورة' : 'مسودة'}
              </span>
              {template && (
                <span className="flex items-center gap-1 text-gold-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  {template.name}
                </span>
              )}
              {pkg && <span className="text-cream-300/50">{formatPrice(pkg.price)}</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="btn-outline-gold flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
            >
              <Edit3 className="h-4 w-4" />
              {editing ? 'إلغاء' : 'تعديل'}
            </button>
            {event.status !== 'published' && (
              <button
                onClick={handlePublish}
                className="btn-gold flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
              >
                <Check className="h-4 w-4" />
                نشر الدعوة
              </button>
            )}
            {event.status === 'published' && invitationUrl && (
              <a
                href={invitationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                عرض الدعوة
              </a>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-xl border border-rose-500/30 px-4 py-2 text-sm text-rose-400/80 hover:bg-rose-500/10 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </button>
          </div>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gold-500/10 pt-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-cream-300/60">اسم المضيف</label>
              <input
                value={editForm.host_name}
                onChange={(e) => setEditForm({ ...editForm, host_name: e.target.value })}
                className="input-luxury w-full rounded-xl px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs text-cream-300/60">المكان</label>
              <input
                value={editForm.venue}
                onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                className="input-luxury w-full rounded-xl px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs text-cream-300/60">التاريخ</label>
              <input
                type="date"
                value={editForm.event_date}
                onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })}
                className="input-luxury w-full rounded-xl px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs text-cream-300/60">الوقت</label>
              <input
                type="time"
                value={editForm.event_time}
                onChange={(e) => setEditForm({ ...editForm, event_time: e.target.value })}
                className="input-luxury w-full rounded-xl px-4 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <button onClick={handleSaveEdit} className="btn-gold rounded-xl px-6 py-2.5 text-sm">
                حفظ التغييرات
              </button>
            </div>
          </div>
        )}

        {/* Event info */}
        {!editing && (
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-cream-300/70 md:grid-cols-3">
            {event.event_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold-500/50" />
                {new Date(event.event_date).toLocaleDateString('ar-SY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
            {event.event_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-500/50" />
                {event.event_time}
              </div>
            )}
            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-500/50" />
                {event.venue}
              </div>
            )}
          </div>
        )}

        {/* Share link */}
        {event.status === 'published' && invitationUrl && (
          <div className="mt-6 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gold-400">
              <Share2 className="h-4 w-4" />
              رابط الدعوة العام
            </div>
            <div className="flex items-center gap-2">
              <input
                value={invitationUrl}
                readOnly
                className="input-luxury flex-1 rounded-xl px-4 py-2 text-xs"
                dir="ltr"
              />
              <button
                onClick={handleCopy}
                className="btn-gold flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
            <p className="mt-2 text-xs text-cream-300/40">
              شارك هذا الرابط مع ضيوفك عبر واتساب أو أي وسيلة
            </p>
          </div>
        )}
      </div>

      {/* RSVP Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatBox icon={<Users className="h-5 w-5" />} label="إجمالي الضيوف" value={stats.total} />
        <StatBox icon={<CheckCircle className="h-5 w-5" />} label="سيحضرون" value={stats.attending} color="text-emerald-400" />
        <StatBox icon={<Clock className="h-5 w-5" />} label="بانتظار الرد" value={stats.pending} color="text-amber-400" />
        <StatBox icon={<XCircle className="h-5 w-5" />} label="اعتذروا" value={stats.declined} color="text-rose-400" />
      </div>

      {/* Guest list */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold text-cream-100">قائمة الضيوف</h2>

        {guests.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-cream-300/30" />
            <p className="text-sm text-cream-300/50">
              لا توجد ردود بعد. شارك رابط الدعوة مع ضيوفك لتبدأ باستقبال الردود.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between rounded-xl border border-gold-500/10 bg-navy-800/30 p-4"
              >
                <div>
                  <div className="font-medium text-cream-100">{guest.name}</div>
                  {guest.phone && <div className="text-xs text-cream-300/50" dir="ltr">{guest.phone}</div>}
                  {guest.rsvp_message && (
                    <div className="mt-1 text-xs text-cream-300/40">"{guest.rsvp_message}"</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {guest.plus_ones > 0 && (
                    <span className="text-xs text-cream-300/50">+{guest.plus_ones}</span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      guest.rsvp_status === 'attending'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : guest.rsvp_status === 'declined'
                        ? 'bg-rose-500/15 text-rose-400'
                        : guest.rsvp_status === 'maybe'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-navy-700 text-cream-300/50'
                    }`}
                  >
                    {guest.rsvp_status === 'attending'
                      ? 'سيحضر'
                      : guest.rsvp_status === 'declined'
                      ? 'اعتذر'
                      : guest.rsvp_status === 'maybe'
                      ? 'ربما'
                      : 'بانتظار'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatBox({ icon, label, value, color = 'text-gold-400' }: { icon: React.ReactNode; label: string; value: number; color?: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <div className="font-serif text-2xl font-semibold text-cream-100">{value}</div>
      <div className="mt-1 text-xs text-cream-300/50">{label}</div>
    </div>
  );
}
