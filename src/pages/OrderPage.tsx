import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  FileText,
  Package,
  Send,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import TemplatePreview from '../components/TemplatePreview';
import { Spinner } from '../components/ui';
import { TEMPLATES, getTemplate } from '../data/templates';
import { PRICING_PACKAGES, EVENT_TYPES, formatPrice, WHATSAPP_NUMBER, type EventType, type PackageType } from '../types';
import { supabase } from '../lib/supabase';

export default function OrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTemplate = searchParams.get('template') || '';

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form state
  const [templateId, setTemplateId] = useState(preselectedTemplate);
  const [packageType, setPackageType] = useState<PackageType>('standard');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [venue, setVenue] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!preselectedTemplate && step === 1) {
      // No preselected template — start at template selection
    }
  }, [preselectedTemplate, step]);

  const selectedTemplate = templateId ? getTemplate(templateId) : undefined;
  const selectedPackage = PRICING_PACKAGES.find((p) => p.id === packageType)!;

  const buildWhatsAppMessage = (): string => {
    const eventTypeLabel = EVENT_TYPES.find((t) => t.value === eventType)?.label || eventType;
    const templateName = selectedTemplate?.name || 'لم يتم الاختيار';
    const packageName = selectedPackage.name;
    const dateStr = eventDate
      ? new Date(eventDate).toLocaleDateString('ar-SY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : 'لم يتم التحديد';

    return `🌟 *طلب دعوة رقمية فاخرة* 🌟

━━━━━━━━━━━━━━━━━━━

📋 *تفاصيل الطلب:*

• القالب: ${templateName}
• الباقة: ${packageName}
• السعر: ${formatPrice(selectedPackage.price)}

━━━━━━━━━━━━━━━━━━━

👤 *معلومات العميل:*

• الاسم: ${customerName}
• الهاتف: ${customerPhone}

━━━━━━━━━━━━━━━━━━━

🎉 *تفاصيل المناسبة:*

• النوع: ${eventTypeLabel}
• التاريخ: ${dateStr}
• الوقت: ${eventTime || 'لم يتم التحديد'}
• المكان: ${venue || 'لم يتم التحديد'}
• عدد الضيوف: ${guestCount || 'غير محدد'}

━━━━━━━━━━━━━━━━━━━

📝 *ملاحظات إضافية:*
${notes || 'لا يوجد'}

━━━━━━━━━━━━━━━━━━━

💰 *طريقة الدفع: كاش (نقداً) بالليرة السورية*

أرجو تأكيد الطلب وموعد التسليم. شكراً لكم! 🌹`;
  };

  const handleSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim()) return;
    if (!templateId) return;

    setSubmitting(true);
    setSubmitError('');

    // Save to database
    const { error } = await supabase.from('inquiries').insert({
      customer_name: customerName,
      customer_phone: customerPhone,
      event_type: eventType,
      event_date: eventDate || null,
      event_time: eventTime,
      venue,
      template_id: templateId,
      package_type: packageType,
      guest_count: parseInt(guestCount) || 0,
      notes,
      status: 'new',
    });

    if (error) {
      setSubmitError('تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.');
      setSubmitting(false);
      return;
    }

    // Open WhatsApp with pre-filled message
    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setSubmitting(false);
    setSubmitted(true);
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Navbar />
        <WhatsAppButton />
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10">
            <Check className="h-12 w-12 text-emerald-400" />
          </div>
          <h1 className="font-serif text-4xl font-light text-cream-100">تم إرسال طلبك!</h1>
          <p className="mt-4 max-w-md text-cream-300/60">
            تم فتح واتساب مع رسالة تحتوي جميع تفاصيل طلبك. أرسل الرسالة وسنتواصل معك لتأكيد الطلب والدفع.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate('/')} className="btn-outline-gold rounded-xl px-6 py-3 text-sm">
              العودة للرئيسية
            </button>
            <button onClick={() => navigate('/templates')} className="btn-gold rounded-xl px-6 py-3 text-sm">
              تصفح قوالب أخرى
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'القالب' },
    { num: 2, label: 'الباقة' },
    { num: 3, label: 'التفاصيل' },
    { num: 4, label: 'الإرسال' },
  ];

  const canProceed = () => {
    if (step === 1) return !!templateId;
    if (step === 2) return !!packageType;
    if (step === 3) return customerName.trim().length > 1 && customerPhone.trim().length >= 6;
    return true;
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <WhatsAppButton />

      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate('/templates')}
            className="mb-6 flex items-center gap-2 text-sm text-cream-300/60 hover:text-gold-400 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للقوالب
          </button>

          <h1 className="font-serif text-3xl font-semibold text-cream-100">اطلب دعوتك الفاخرة</h1>
          <p className="mt-2 text-sm text-cream-300/60">املأ التفاصيل وسنرسلها مباشرة عبر واتساب</p>

          {/* Steps */}
          <div className="mb-8 mt-8 flex items-center justify-center gap-2 md:gap-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 md:gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    step >= s.num
                      ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                      : 'border-cream-300/20 text-cream-300/40'
                  }`}
                >
                  {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                </div>
                <span className={`hidden text-sm md:block ${step >= s.num ? 'text-gold-400' : 'text-cream-300/40'}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`h-px w-8 md:w-16 ${step > s.num ? 'bg-gold-500' : 'bg-cream-300/20'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8">
            {/* Step 1: Template Selection */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="mb-4 font-serif text-xl font-semibold text-cream-100">اختر القالب</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`overflow-hidden rounded-xl border-2 transition-all ${
                        templateId === t.id
                          ? 'border-gold-500/50 shadow-[0_0_20px_rgba(197,165,90,0.2)]'
                          : 'border-cream-300/10 hover:border-gold-500/20'
                      }`}
                    >
                      <div className="flex h-20 items-center justify-center" style={{ backgroundColor: t.preview.bg }}>
                        <span className="font-serif text-sm" style={{ color: t.preview.accent }}>{t.name}</span>
                      </div>
                      <div className="bg-navy-800/50 p-2 text-center text-xs text-cream-300/60">
                        {formatPrice(t.price)}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedTemplate && (
                  <div className="mt-6">
                    <TemplatePreview template={selectedTemplate} />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Package Selection */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="mb-4 font-serif text-xl font-semibold text-cream-100">اختر الباقة</h2>
                <div className="space-y-4">
                  {PRICING_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setPackageType(pkg.id)}
                      className={`w-full rounded-2xl border-2 p-5 text-right transition-all ${
                        packageType === pkg.id
                          ? 'border-gold-500/50 bg-gold-500/5'
                          : 'border-cream-300/10 hover:border-gold-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-gold-400" />
                            <span className="font-serif text-lg font-semibold text-cream-100">{pkg.name}</span>
                            {pkg.popular && (
                              <span className="rounded-full bg-gold-500/10 px-2 py-0.5 text-xs text-gold-400">الأكثر طلباً</span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-cream-300/50">{pkg.description}</p>
                        </div>
                        <span className="font-serif text-xl font-semibold text-gold-400">{formatPrice(pkg.price)}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {pkg.features.slice(0, 4).map((f, i) => (
                          <span key={i} className="flex items-center gap-1 text-xs text-cream-300/50">
                            <Check className="h-3 w-3 text-gold-400" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Event Details */}
            {step === 3 && (
              <div className="animate-fade-in space-y-5">
                <h2 className="mb-4 font-serif text-xl font-semibold text-cream-100">أدخل تفاصيل المناسبة</h2>

                {/* Live preview */}
                {selectedTemplate && (
                  <div className="mb-5">
                    <TemplatePreview
                      template={selectedTemplate}
                      title={customerName ? `دعوة ${customerName}` : 'اسم المناسبة'}
                      hostName={customerName || 'اسم المضيف'}
                      eventDate={
                        eventDate
                          ? new Date(eventDate).toLocaleDateString('ar-SY', { day: 'numeric', month: 'long', year: 'numeric' })
                          : 'تاريخ المناسبة'
                      }
                      venue={venue || 'المكان · المدينة'}
                    />
                    <p className="mt-2 text-center text-xs text-cream-300/40">
                      معاينة حية — تظهر بياناتك في القالب مباشرة
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                      <User className="h-4 w-4 text-gold-500/50" /> الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="اسمك الكامل"
                      className="input-luxury w-full rounded-xl py-3 px-4 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                      <MessageCircle className="h-4 w-4 text-gold-500/50" /> رقم الهاتف / واتساب *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="09xxxxxxxx"
                      className="input-luxury w-full rounded-xl py-3 px-4 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-cream-300/80">نوع المناسبة</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EVENT_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setEventType(t.value)}
                        className={`rounded-xl border px-3 py-2.5 text-sm transition-all ${
                          eventType === t.value
                            ? 'border-gold-500/40 bg-gold-500/10 text-gold-400'
                            : 'border-cream-300/15 text-cream-300/60 hover:border-gold-500/20'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                      <Calendar className="h-4 w-4 text-gold-500/50" /> تاريخ المناسبة
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="input-luxury w-full rounded-xl py-3 px-4 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                      <Clock className="h-4 w-4 text-gold-500/50" /> وقت المناسبة
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="input-luxury w-full rounded-xl py-3 px-4 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                      <MapPin className="h-4 w-4 text-gold-500/50" /> المكان / القاعة
                    </label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="اسم القاعة، المدينة"
                      className="input-luxury w-full rounded-xl py-3 px-4 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                      <Users className="h-4 w-4 text-gold-500/50" /> عدد الضيوف التقريبي
                    </label>
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="مثال: 100"
                      min={0}
                      className="input-luxury w-full rounded-xl py-3 px-4 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-cream-300/80">
                    <FileText className="h-4 w-4 text-gold-500/50" /> ملاحظات إضافية
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="أي تفاصيل أو طلبات خاصة..."
                    className="input-luxury w-full rounded-xl py-3 px-4 text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Send */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="mb-4 font-serif text-xl font-semibold text-cream-100">راجع تفاصيل طلبك</h2>

                <div className="space-y-4">
                  {selectedTemplate && (
                    <div className="mb-4">
                      <TemplatePreview template={selectedTemplate} />
                    </div>
                  )}

                  <div className="glass-card rounded-xl p-5 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gold-500/10 pb-2">
                      <span className="text-cream-300/50">القالب</span>
                      <span className="text-cream-100">{selectedTemplate?.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gold-500/10 pb-2">
                      <span className="text-cream-300/50">الباقة</span>
                      <span className="text-cream-100">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gold-500/10 pb-2">
                      <span className="text-cream-300/50">الاسم</span>
                      <span className="text-cream-100">{customerName}</span>
                    </div>
                    <div className="flex justify-between border-b border-gold-500/10 pb-2">
                      <span className="text-cream-300/50">الهاتف</span>
                      <span className="text-cream-100">{customerPhone}</span>
                    </div>
                    <div className="flex justify-between border-b border-gold-500/10 pb-2">
                      <span className="text-cream-300/50">نوع المناسبة</span>
                      <span className="text-cream-100">{EVENT_TYPES.find((t) => t.value === eventType)?.label}</span>
                    </div>
                    {eventDate && (
                      <div className="flex justify-between border-b border-gold-500/10 pb-2">
                        <span className="text-cream-300/50">التاريخ</span>
                        <span className="text-cream-100">{new Date(eventDate).toLocaleDateString('ar-SY')}</span>
                      </div>
                    )}
                    {eventTime && (
                      <div className="flex justify-between border-b border-gold-500/10 pb-2">
                        <span className="text-cream-300/50">الوقت</span>
                        <span className="text-cream-100">{eventTime}</span>
                      </div>
                    )}
                    {venue && (
                      <div className="flex justify-between border-b border-gold-500/10 pb-2">
                        <span className="text-cream-300/50">المكان</span>
                        <span className="text-cream-100">{venue}</span>
                      </div>
                    )}
                    {guestCount && (
                      <div className="flex justify-between border-b border-gold-500/10 pb-2">
                        <span className="text-cream-300/50">عدد الضيوف</span>
                        <span className="text-cream-100">{guestCount}</span>
                      </div>
                    )}
                    {notes && (
                      <div className="border-b border-gold-500/10 pb-2">
                        <span className="text-cream-300/50 block mb-1">ملاحظات</span>
                        <span className="text-cream-100">{notes}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <span className="text-gold-400 font-semibold">السعر</span>
                      <span className="text-gold-400 font-serif text-xl font-semibold">{formatPrice(selectedPackage.price)}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-300/80">
                    <Check className="mb-2 h-5 w-5 text-emerald-400" />
                    عند الضغط على "إرسال الطلب"، سيتم فتح واتساب مع رسالة تحتوي جميع تفاصيل طلبك.
                    أرسل الرسالة وسنتواصل معك لتأكيد الطلب والدفع (كاش بالليرة السورية).
                  </div>

                  {submitError && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                      {submitError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => (step > 1 ? setStep(step - 1) : navigate('/templates'))}
                className="text-sm text-cream-300/60 hover:text-gold-400 transition-colors"
              >
                {step > 1 ? 'السابق' : 'إلغاء'}
              </button>
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="btn-gold rounded-xl px-6 py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  التالي
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-gold flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? <Spinner size={18} /> : <Send className="h-4 w-4" />}
                  {submitting ? 'جاري الإرسال...' : 'إرسال الطلب عبر واتساب'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
