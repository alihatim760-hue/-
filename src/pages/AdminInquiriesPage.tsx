import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  CheckCircle,
  Clock,
  Phone,
  Calendar,
  Sparkles,
  Plus,
  MessageCircle,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../data/templates';
import { PRICING_PACKAGES, EVENT_TYPES, WHATSAPP_NUMBER, generateSlug, formatPrice, type Inquiry, type InquiryStatus } from '../types';


const STATUS_LABELS: Record<InquiryStatus, { label: string; color: string }> = {
  new: { label: 'جديد', color: 'bg-amber-500/15 text-amber-400' },
  contacted: { label: 'تم التواصل', color: 'bg-blue-500/15 text-blue-400' },
  confirmed: { label: 'مؤكد', color: 'bg-emerald-500/15 text-emerald-400' },
  completed: { label: 'مكتمل', color: 'bg-gold-500/15 text-gold-400' },
  cancelled: { label: 'ملغي', color: 'bg-rose-500/15 text-rose-400' },
};

const PAGE_SIZE = 10;

export default function AdminInquiriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all');
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      setInquiries((data as Inquiry[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    if (!error) {
      setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
    }
  };

  const createEventFromInquiry = async (inquiry: Inquiry) => {
    if (!user) return;
    setCreating(inquiry.id);
    setCreateError('');
    const slug = generateSlug();
    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        title: `${inquiry.customer_name} - ${EVENT_TYPES.find((t) => t.value === inquiry.event_type)?.label || 'مناسبة'}`,
        host_name: inquiry.customer_name,
        event_type: inquiry.event_type,
        event_date: inquiry.event_date,
        event_time: inquiry.event_time,
        venue: inquiry.venue,
        template_id: inquiry.template_id,
        package_type: inquiry.package_type,
        status: 'draft',
        invitation_slug: slug,
        notes: inquiry.notes,
      })
      .select('*')
      .maybeSingle();

    if (error) {
      setCreateError('تعذّر إنشاء الدعوة. يرجى المحاولة مرة أخرى.');
    } else if (data) {
      await supabase.from('inquiries').update({ status: 'confirmed' }).eq('id', inquiry.id);
      setInquiries(inquiries.map((i) => (i.id === inquiry.id ? { ...i, status: 'confirmed' } : i)));
      navigate(`/dashboard/events/${data.id}`);
    }
    setCreating(null);
  };

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    confirmed: inquiries.filter((i) => i.status === 'confirmed').length,
    completed: inquiries.filter((i) => i.status === 'completed').length,
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-cream-100">الطلبات الواردة</h1>
        <p className="mt-2 text-sm text-cream-300/60">جميع طلبات الدعوات الواردة من الموقع</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-2 text-gold-400"><Inbox className="h-5 w-5" /></div>
          <div className="font-serif text-2xl font-semibold text-cream-100">{stats.total}</div>
          <div className="text-xs text-cream-300/50">إجمالي الطلبات</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-2 text-amber-400"><Clock className="h-5 w-5" /></div>
          <div className="font-serif text-2xl font-semibold text-cream-100">{stats.new}</div>
          <div className="text-xs text-cream-300/50">طلبات جديدة</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-2 text-emerald-400"><CheckCircle className="h-5 w-5" /></div>
          <div className="font-serif text-2xl font-semibold text-cream-100">{stats.confirmed}</div>
          <div className="text-xs text-cream-300/50">مؤكدة</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-2 text-gold-400"><Sparkles className="h-5 w-5" /></div>
          <div className="font-serif text-2xl font-semibold text-cream-100">{stats.completed}</div>
          <div className="text-xs text-cream-300/50">مكتملة</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => { setFilter('all'); setPage(0); }}
          className={`rounded-xl px-4 py-2 text-sm transition-all ${
            filter === 'all' ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'text-cream-300/60 border border-transparent'
          }`}
        >
          الكل ({inquiries.length})
        </button>
        {(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => { setFilter(status); setPage(0); }}
            className={`rounded-xl px-4 py-2 text-sm transition-all ${
              filter === status ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'text-cream-300/60 border border-transparent'
            }`}
          >
            {STATUS_LABELS[status].label} ({inquiries.filter((i) => i.status === status).length})
          </button>
        ))}
      </div>

      {/* Inquiries list */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500 h-10 w-10" />
        </div>
      ) : (
        <>
          {createError && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
              {createError}
            </div>
          )}
          {paged.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Inbox className="mx-auto mb-4 h-12 w-12 text-cream-300/30" />
              <h3 className="font-serif text-xl text-cream-100">لا توجد طلبات</h3>
              <p className="mt-2 text-sm text-cream-300/50">
                ستظهر هنا طلبات الدعوات الواردة من الموقع
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paged.map((inquiry) => {
                const template = getTemplate(inquiry.template_id);
                const pkg = PRICING_PACKAGES.find((p) => p.id === inquiry.package_type);
                return (
                  <div key={inquiry.id} className="glass-card rounded-2xl p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      {/* Left: customer info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-serif text-lg font-semibold text-cream-100">{inquiry.customer_name}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_LABELS[inquiry.status].color}`}>
                            {STATUS_LABELS[inquiry.status].label}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-cream-300/50">
                          <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً ${inquiry.customer_name}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[#25D366] hover:underline"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {inquiry.customer_phone}
                          </a>
                          {inquiry.event_date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(inquiry.event_date).toLocaleDateString('ar-SY')}
                            </span>
                          )}
                          {inquiry.venue && (
                            <span className="flex items-center gap-1.5">
                              <span className="text-gold-500/50">●</span>
                              {inquiry.venue}
                            </span>
                          )}
                          {template && (
                            <span className="flex items-center gap-1.5 text-gold-400">
                              <Sparkles className="h-3.5 w-3.5" />
                              {template.name}
                            </span>
                          )}
                          {pkg && (
                            <span className="flex items-center gap-1.5">
                              <Package className="h-3.5 w-3.5" />
                              {pkg.name} · {formatPrice(pkg.price)}
                            </span>
                          )}
                          {inquiry.guest_count > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              {inquiry.guest_count} ضيف
                            </span>
                          )}
                        </div>

                        {inquiry.notes && (
                          <p className="mt-3 rounded-xl border border-gold-500/10 bg-navy-800/30 p-3 text-sm text-cream-300/60">
                            {inquiry.notes}
                          </p>
                        )}

                        <p className="mt-3 text-xs text-cream-300/30">
                          {new Date(inquiry.created_at).toLocaleString('ar-SY')}
                        </p>
                      </div>

                      {/* Right: actions */}
                      <div className="flex flex-col gap-2 md:w-48">
                        {/* Status selector */}
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateStatus(inquiry.id, e.target.value as InquiryStatus)}
                          className="input-luxury rounded-xl px-3 py-2 text-sm"
                        >
                          {(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                          ))}
                        </select>

                        {/* WhatsApp contact */}
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً ${inquiry.customer_name}، بخصوص طلب الدعوة (${template?.name || ''})`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 px-4 py-2 text-sm text-[#25D366] hover:bg-[#25D366]/10 transition-all"
                        >
                          <MessageCircle className="h-4 w-4" />
                          تواصل عبر واتساب
                        </a>

                        {/* Create event */}
                        {inquiry.status !== 'confirmed' && inquiry.status !== 'completed' && (
                          <button
                            onClick={() => createEventFromInquiry(inquiry)}
                            disabled={creating === inquiry.id}
                            className="btn-gold flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm disabled:opacity-50"
                          >
                            {creating === inquiry.id ? (
                              <div className="animate-spin rounded-full border-2 border-navy-900/30 border-t-navy-900 h-4 w-4" />
                            ) : (
                              <>
                                <Plus className="h-4 w-4" />
                                إنشاء دعوة
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/20 text-cream-300/60 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-cream-300/50">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/20 text-cream-300/60 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
