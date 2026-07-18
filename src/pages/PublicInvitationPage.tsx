import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  Send,
  Copy,
  Check,
  Users,
  MessageCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../data/templates';
import SEO from '../components/SEO';
import { EVENT_TYPES, WHATSAPP_NUMBER, type InvitationEvent, type RSVPStatus } from '../types';

export default function PublicInvitationPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<InvitationEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);

  // RSVP form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('attending');
  const [plusOnes, setPlusOnes] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('invitation_slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
      } else {
        setEvent(data as InvitationEvent);
      }
      setLoading(false);
    })();
  }, [slug]);

  const template = event ? getTemplate(event.template_id) : undefined;
  const eventTypeLabel = event ? EVENT_TYPES.find((t) => t.value === event.event_type)?.label : '';

  const invitationUrl = window.location.href;

  // Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  useEffect(() => {
    if (!event?.event_date) return;
    const target = new Date(`${event.event_date}T${event.event_time || '00:00:00'}`).getTime();
    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [event]);

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `دعوتك لحضور ${event?.title || 'مناسبة'} — ${event?.event_date ? new Date(event.event_date).toLocaleDateString('ar-SY') : ''}${event?.venue ? ` في ${event.venue}` : ''}\n${invitationUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!event || !name.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    const { error } = await supabase.from('guests').insert({
      event_id: event.id,
      name: name.trim(),
      phone: phone.trim(),
      rsvp_status: rsvpStatus,
      plus_ones: rsvpStatus === 'attending' ? plusOnes : 0,
      rsvp_message: message.trim(),
      rsvp_at: new Date().toISOString(),
    });
    setSubmitting(false);
    if (error) {
      setSubmitError('تعذّر إرسال الرد. يرجى المحاولة مرة أخرى.');
    } else {
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900">
        <div className="animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500 h-10 w-10" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-4 text-center">
        <Sparkles className="mb-4 h-16 w-16 text-gold-500/40" />
        <h1 className="font-serif text-3xl text-cream-100">الدعوة غير متوفرة</h1>
        <p className="mt-2 text-cream-300/50">ربما تم حذف الدعوة أو أن الرابط غير صحيح</p>
      </div>
    );
  }

  if (!event || !template) return null;

  const { bg, accent, text } = template.preview;

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <SEO
        title={event.title}
        description={`دعوة ${EVENT_TYPES.find((t) => t.value === event.event_type)?.label || 'مناسبة'} — ${event.host_name || ''}${event.event_date ? ` في ${new Date(event.event_date).toLocaleDateString('ar-SY')}` : ''}${event.venue ? ` - ${event.venue}` : ''}`}
      />
      {/* Hero invitation card */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${accent}20 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl" style={{ backgroundColor: `${accent}15` }} />

        <div className="relative z-10 w-full max-w-2xl">
          <div className="rounded-3xl border-2 p-8 md:p-12 text-center" style={{ borderColor: `${accent}40`, backgroundColor: `${bg}f0` }}>
            {/* Ornament top */}
            <div className="mx-auto mb-6 flex items-center justify-center gap-3">
              <div className="h-px w-16" style={{ backgroundColor: accent }} />
              <Sparkles className="h-5 w-5" style={{ color: accent }} />
              <div className="h-px w-16" style={{ backgroundColor: accent }} />
            </div>

            <p className="text-sm uppercase tracking-[0.4em]" style={{ color: accent }}>
              {eventTypeLabel}
            </p>

            <h1 className="mt-6 font-serif text-4xl font-light md:text-6xl" style={{ color: text }}>
              {event.title}
            </h1>

            {event.host_name && (
              <p className="mt-4 font-serif text-xl" style={{ color: accent }}>
                يدعوكم {event.host_name}
              </p>
            )}

            <div className="mx-auto mt-6 flex items-center justify-center gap-3">
              <div className="h-px w-12" style={{ backgroundColor: accent }} />
              <Sparkles className="h-4 w-4" style={{ color: accent }} />
              <div className="h-px w-12" style={{ backgroundColor: accent }} />
            </div>

            {/* Event details */}
            <div className="mt-8 space-y-3">
              {event.event_date && (
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: `${text}cc` }}>
                  <Calendar className="h-4 w-4" style={{ color: accent }} />
                  {new Date(event.event_date).toLocaleDateString('ar-SY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
              {event.event_time && (
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: `${text}cc` }}>
                  <Clock className="h-4 w-4" style={{ color: accent }} />
                  {event.event_time}
                </div>
              )}
              {event.venue && (
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: `${text}cc` }}>
                  <MapPin className="h-4 w-4" style={{ color: accent }} />
                  {event.venue}
                </div>
              )}
            </div>

            {/* Countdown */}
            {!timeLeft.expired && event.event_date && (
              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-widest" style={{ color: `${text}99` }}>
                  العد التنازلي
                </p>
                <div className="flex justify-center gap-3">
                  {[
                    { label: 'يوم', value: timeLeft.days },
                    { label: 'ساعة', value: timeLeft.hours },
                    { label: 'دقيقة', value: timeLeft.minutes },
                    { label: 'ثانية', value: timeLeft.seconds },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      className="flex flex-col items-center rounded-2xl border px-4 py-3 md:px-5 md:py-4"
                      style={{ borderColor: `${accent}40`, backgroundColor: `${accent}10` }}
                    >
                      <span className="font-serif text-2xl font-semibold md:text-3xl" style={{ color: accent }}>
                        {String(unit.value).padStart(2, '0')}
                      </span>
                      <span className="mt-1 text-xs" style={{ color: `${text}99` }}>{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {timeLeft.expired && event.event_date && (
              <div className="mt-8 rounded-2xl border p-4 text-center" style={{ borderColor: `${accent}40`, backgroundColor: `${accent}10` }}>
                <p className="font-serif text-lg" style={{ color: accent }}>المناسبة قد انتهت</p>
                <p className="mt-1 text-sm" style={{ color: `${text}99` }}>شكراً لكل من شاركنا هذه المناسبة</p>
              </div>
            )}

            {/* Share buttons */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                <MessageCircle className="h-4 w-4" />
                مشاركة عبر واتساب
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all"
                style={{ borderColor: `${accent}40`, color: text }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'تم النسخ' : 'نسخ الرابط'}
              </button>
            </div>

            {/* QR Code */}
            <div className="mt-6 flex flex-col items-center">
              <p className="mb-2 text-xs" style={{ color: `${text}99` }}>امسح الرمز لمشاركة الدعوة</p>
              <div className="rounded-2xl border-2 bg-white p-3" style={{ borderColor: `${accent}40` }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(invitationUrl)}`}
                  alt="QR Code"
                  width={120}
                  height={120}
                />
              </div>
            </div>

            {/* RSVP CTA */}
            {!timeLeft.expired && (
              <a
                href="#rsvp"
                className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: accent, color: bg }}
              >
                <Send className="h-4 w-4" />
                أكد حضورك
              </a>
            )}

            {/* Ornament bottom */}
            <div className="mx-auto mt-8 flex items-center justify-center gap-3">
              <div className="h-px w-16" style={{ backgroundColor: accent }} />
              <Sparkles className="h-5 w-5" style={{ color: accent }} />
              <div className="h-px w-16" style={{ backgroundColor: accent }} />
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Form */}
      {!timeLeft.expired && (
        <section id="rsvp" className="px-4 py-16" style={{ backgroundColor: `${bg}` }}>
          <div className="mx-auto max-w-lg">
            <div className="rounded-3xl border-2 p-8" style={{ borderColor: `${accent}30`, backgroundColor: `${bg}f0` }}>
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}20` }}>
                    <CheckCircle className="h-8 w-8" style={{ color: accent }} />
                  </div>
                  <h2 className="font-serif text-2xl" style={{ color: text }}>شكراً لك!</h2>
                  <p className="mt-2 text-sm" style={{ color: `${text}99` }}>
                    {rsvpStatus === 'attending'
                      ? 'تم استلام تأكيد حضورك. نتطلع لرؤيتك في المناسبة.'
                      : rsvpStatus === 'declined'
                      ? 'تم استلام اعتذارك. شكراً لإعلامك.'
                      : 'تم استلام ردك. سنعلمك بأي تحديثات.'}
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="mb-2 text-center font-serif text-2xl" style={{ color: text }}>
                    تأكيد الحضور
                  </h2>
                  <p className="mb-6 text-center text-sm" style={{ color: `${text}99` }}>
                    يرجى تأكيد حضورك قبل الموعد
                  </p>

                  {submitError && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm" style={{ color: `${text}cc` }}>الاسم *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="اسمك الكامل"
                        className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all"
                        style={{ borderColor: `${accent}30`, backgroundColor: `${bg}`, color: text }}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm" style={{ color: `${text}cc` }}>رقم الهاتف (اختياري)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09xxxxxxxx"
                        dir="ltr"
                        className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all"
                        style={{ borderColor: `${accent}30`, backgroundColor: `${bg}`, color: text }}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm" style={{ color: `${text}cc` }}>حالتك *</label>
                      <div className="grid grid-cols-3 gap-2">
                        <RSVPButton
                          active={rsvpStatus === 'attending'}
                          onClick={() => setRsvpStatus('attending')}
                          icon={<CheckCircle className="h-5 w-5" />}
                          label="سأحضر"
                          accent={accent}
                          bg={bg}
                          text={text}
                          activeColor="#10b981"
                        />
                        <RSVPButton
                          active={rsvpStatus === 'maybe'}
                          onClick={() => setRsvpStatus('maybe')}
                          icon={<HelpCircle className="h-5 w-5" />}
                          label="ربما"
                          accent={accent}
                          bg={bg}
                          text={text}
                          activeColor="#f59e0b"
                        />
                        <RSVPButton
                          active={rsvpStatus === 'declined'}
                          onClick={() => setRsvpStatus('declined')}
                          icon={<XCircle className="h-5 w-5" />}
                          label="لن أحضر"
                          accent={accent}
                          bg={bg}
                          text={text}
                          activeColor="#f43f5e"
                        />
                      </div>
                    </div>

                    {rsvpStatus === 'attending' && (
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm" style={{ color: `${text}cc` }}>
                          <Users className="h-4 w-4" />
                          عدد المرافقين
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setPlusOnes(Math.max(0, plusOnes - 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 text-lg"
                            style={{ borderColor: `${accent}30`, color: text }}
                          >
                            -
                          </button>
                          <span className="font-serif text-2xl" style={{ color: text }}>{plusOnes}</span>
                          <button
                            type="button"
                            onClick={() => setPlusOnes(Math.min(10, plusOnes + 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 text-lg"
                            style={{ borderColor: `${accent}30`, color: text }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-sm" style={{ color: `${text}cc` }}>رسالة (اختياري)</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="أي رسالة تود إرسالها..."
                        className="w-full resize-none rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all"
                        style={{ borderColor: `${accent}30`, backgroundColor: `${bg}`, color: text }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-all disabled:opacity-50"
                      style={{ backgroundColor: accent, color: bg }}
                    >
                      {submitting ? 'جاري الإرسال...' : 'إرسال الرد'}
                      {!submitting && <Send className="h-4 w-4" />}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8 text-center" style={{ borderColor: `${accent}20` }}>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: accent }} />
          <span className="font-serif text-sm" style={{ color: `${text}99` }}>دعوات فاخرة</span>
        </div>
        <p className="mt-2 text-xs" style={{ color: `${text}66` }}>
          للاستفسار عن تصميم دعوتك الخاصة، تواصل معنا عبر واتساب
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs"
          style={{ color: accent }}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          00963993812129
        </a>
      </footer>
    </div>
  );
}

function RSVPButton({
  active,
  onClick,
  icon,
  label,
  accent,
  bg,
  text,
  activeColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  accent: string;
  bg: string;
  text: string;
  activeColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-4 text-sm transition-all"
      style={{
        borderColor: active ? activeColor : `${accent}30`,
        backgroundColor: active ? `${activeColor}15` : `${bg}`,
        color: active ? activeColor : `${text}cc`,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
