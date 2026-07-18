import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Palette,
  MessageCircle,
  Clock,
  Check,
  ArrowLeft,
  Star,
  Quote,
  CalendarHeart,
  Users,
  Mail,
  ChevronDown,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import TemplatePreview from '../components/TemplatePreview';
import SEO from '../components/SEO';
import { SectionTitle } from '../components/ui';
import { TEMPLATES } from '../data/templates';
import { PRICING_PACKAGES, formatPrice, WHATSAPP_NUMBER } from '../types';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: <Palette className="h-7 w-7" />, title: 'قوالب فاخرة', desc: '8 قوالب مصممة بعناية لكل مناسبة' },
    { icon: <MessageCircle className="h-7 w-7" />, title: 'طلب عبر واتساب', desc: 'اختر قالبك وأرسل التفاصيل مباشرة' },
    { icon: <Clock className="h-7 w-7" />, title: 'تسليم سريع', desc: 'استلم دعوتك خلال 12-48 ساعة' },
    { icon: <Mail className="h-7 w-7" />, title: 'مشاركة سهلة', desc: 'رابط واحد تشاركه مع جميع ضيوفك' },
    { icon: <Users className="h-7 w-7" />, title: 'تتبع الحضور', desc: 'نظام RSVP لتأكيد حضور الضيوف' },
    { icon: <Sparkles className="h-7 w-7" />, title: 'تصميم مخصص', desc: 'تخصيص كامل للألوان والخطوط' },
  ];

  const testimonials = [
    { name: 'سارة العلي', role: 'عروس', text: 'الدعوة كانت أجمل من توقعاتي! التصميم فاخر والضيوف انبهروا بها. شكراً لكم على الاحترافية.', rating: 5 },
    { name: 'خالد حسن', role: 'منظم فعاليات', text: 'استخدمت المنصة لعدة مناسبات شركة. الجودة ممتازة والتسليم في الوقت المحدد. أنصح بها بشدة.', rating: 5 },
    { name: 'نور محمد', role: 'أم', text: 'احتفلت بعيد ميلاد ابنتي بدعوة رقمية مذهلة. التواصل عبر واتساب كان سهل جداً والنتيجة فاقت توقعاتي.', rating: 5 },
    { name: 'رامي الخطيب', role: 'عريس', text: 'اخترت القالب الذهبي الملكي وكان مثالي لزفافنا. الدفع كاش والتسليم سريع. تجربة رائعة.', rating: 5 },
  ];

  const faqs = [
    { q: 'كيف أطلب دعوتي؟', a: 'تصفح القوالب، اختر القالب المناسب، اضغط "اطلب هذا القالب"، ثم املأ النموذج واضغط إرسال. سيتم تحويلك إلى واتساب مع رسالة تحتوي كل تفاصيل طلبك.' },
    { q: 'كيف يتم الدفع؟', a: 'الدفع نقداً (كاش) بالليرة السورية. يتم الاتفاق على الدفع بعد التواصل معك عبر واتساب وتأكيد التفاصيل.' },
    { q: 'كم تستغرق عملية التصميم؟', a: 'حسب الباقة: الباقة الأساسية 48 ساعة، المتوسطة 24 ساعة، والفاخرة 12 ساعة من تأكيد الطلب والدفع.' },
    { q: 'هل يمكنني تعديل التصميم؟', a: 'نعم، الباقة المتوسطة تشمل تعديلات غير محدودة، والفاخرة تشمل تعديلات غير محدودة + تصدير PDF.' },
    { q: 'كيف يصل رابط الدعوة لضيوفي؟', a: 'نرسل لك رابط الدعوة الرقمية تشاركه مع ضيوفك عبر واتساب أو أي وسيلة. الضيوف يفتحون الرابط ويؤكدون حضورهم مباشرة.' },
  ];

  return (
    <div className="min-h-screen bg-navy-900">
      <SEO />
      <Navbar />
      <WhatsAppButton />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(15,26,46,0.88) 0%, rgba(15,26,46,0.95) 100%), url(https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1920)`,
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          />
          <div className="absolute -top-20 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/8 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="animate-fade-in-down">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/5 px-4 py-2">
              <Star className="h-4 w-4 text-gold-400" />
              <span className="text-sm text-gold-300">منصة الدعوات الرقمية الأولى في سوريا</span>
            </div>
          </div>

          <h1 className="animate-fade-in-up font-serif text-5xl md:text-7xl font-light leading-tight text-cream-100" style={{ animationDelay: '0.1s' }}>
            دعوات رقمية
            <br />
            <span className="text-gold-gradient font-medium">تليق بمناسباتك</span>
          </h1>

          <p className="animate-fade-in-up mt-6 text-lg md:text-xl text-cream-300/70" style={{ animationDelay: '0.2s' }}>
            صمم دعوتك الفاخرة، شاركها مع ضيوفك
            <br className="hidden md:block" />
            وتابع ردود الحضور بكل سهولة
          </p>

          <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/templates')}
              className="btn-gold group flex items-center gap-2 rounded-xl px-8 py-4 text-base"
            >
              تصفح القوالب
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold flex items-center gap-2 rounded-xl px-8 py-4 text-base"
            >
              <MessageCircle className="h-5 w-5" />
              تواصل عبر واتساب
            </a>
          </div>

          <div className="animate-fade-in-up mt-16 flex items-center justify-center gap-8 text-cream-300/50" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="font-serif text-3xl font-semibold text-gold-400">+500</div>
              <div className="text-xs mt-1">دعوة منشورة</div>
            </div>
            <div className="h-12 w-px bg-gold-500/20" />
            <div className="text-center">
              <div className="font-serif text-3xl font-semibold text-gold-400">+300</div>
              <div className="text-xs mt-1">عميل سعيد</div>
            </div>
            <div className="h-12 w-px bg-gold-500/20" />
            <div className="text-center">
              <div className="font-serif text-3xl font-semibold text-gold-400">8</div>
              <div className="text-xs mt-1">قوالب فاخرة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            center
            title={<>كل ما تحتاجه لمناسبة <span className="text-gold-400">مثالية</span></>}
            subtitle="نقدم لك تجربة كاملة من التصميم إلى المشاركة وتتبع الحضور"
          />

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card group rounded-2xl p-8 transition-all duration-300 hover:border-gold-500/30 hover:shadow-[0_0_30px_rgba(197,165,90,0.1)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 transition-transform group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-cream-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-300/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Preview */}
      <section className="py-24 px-4 md:px-8 bg-navy-950/50">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            center
            title={<>قوالب <span className="text-gold-400">فاخرة</span> لكل مناسبة</>}
            subtitle="اختر القالب الذي يناسب مناسبتك واطلبه مباشرة عبر واتساب"
          />

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.slice(0, 4).map((template) => (
              <div
                key={template.id}
                onClick={() => navigate(`/templates/${template.id}`)}
                className="group cursor-pointer"
              >
                <TemplatePreview template={template} className="transition-transform group-hover:scale-105" />
                <div className="mt-4 text-center">
                  <h3 className="font-serif text-lg font-semibold text-cream-100 group-hover:text-gold-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="mt-1 text-sm text-gold-400">{formatPrice(template.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/templates')}
              className="btn-outline-gold inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm"
            >
              عرض جميع القوالب
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            center
            title={<>كيف <span className="text-gold-400">نعمل</span></>}
            subtitle="4 خطوات بسيطة تفصلك عن دعوتك الفاخرة"
          />

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { num: '1', icon: <Palette className="h-6 w-6" />, title: 'اختر القالب', desc: 'تصفح القوالب واختر ما يناسب مناسبتك' },
              { num: '2', icon: <MessageCircle className="h-6 w-6" />, title: 'أرسل التفاصيل', desc: 'املأ النموذج وأرسله عبر واتساب' },
              { num: '3', icon: <Sparkles className="h-6 w-6" />, title: 'نصمم دعوتك', desc: 'نصمم لك الدعوة ونرسلها خلال 12-48 ساعة' },
              { num: '4', icon: <Users className="h-6 w-6" />, title: 'شارك وتابع', desc: 'شارك الرابط مع ضيوفك وتابع ردود الحضور' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/5">
                  <span className="font-serif text-2xl font-semibold text-gold-400">{step.num}</span>
                </div>
                <div className="mb-2 flex justify-center text-gold-400">{step.icon}</div>
                <h3 className="font-serif text-lg font-semibold text-cream-100">{step.title}</h3>
                <p className="mt-2 text-sm text-cream-300/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 md:px-8 bg-navy-950/50">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            center
            title={<>باقات <span className="text-gold-400">الأسعار</span></>}
            subtitle="أسعار بالليرة السورية — الدفع كاش بعد تأكيد الطلب"
          />

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PRICING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`glass-card relative rounded-2xl p-8 ${
                  pkg.popular ? 'border-gold-500/40 shadow-[0_0_40px_rgba(197,165,90,0.15)]' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="btn-gold rounded-full px-4 py-1 text-xs font-semibold">
                      الأكثر طلباً
                    </span>
                  </div>
                )}

                <h3 className="font-serif text-2xl font-semibold text-cream-100">{pkg.name}</h3>
                <p className="mt-2 text-sm text-cream-300/60">{pkg.description}</p>

                <div className="mt-6">
                  <span className="font-serif text-4xl font-semibold text-gold-400">
                    {formatPrice(pkg.price)}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-cream-300/70">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/order')}
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                    pkg.popular ? 'btn-gold' : 'btn-outline-gold'
                  }`}
                >
                  اطلب الآن
                </button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-cream-300/40">
            * الأسعار قابلة للتفاوض حسب متطلبات المناسبة — الدفع نقداً بالليرة السورية
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            center
            title={<>آراء <span className="text-gold-400">عملائنا</span></>}
            subtitle="أكثر من 300 عميل سعيد وثقوا بنا لمناسباتهم"
          />

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <Quote className="mb-4 h-8 w-8 text-gold-500/40" />
                <p className="text-sm leading-relaxed text-cream-300/80">{t.text}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 font-serif text-sm text-gold-400">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-cream-100 text-sm">{t.name}</div>
                    <div className="text-xs text-cream-300/50">{t.role}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 md:px-8 bg-navy-950/50">
        <div className="mx-auto max-w-3xl">
          <SectionTitle center title={<>الأسئلة <span className="text-gold-400">الشائعة</span></>} />

          <div className="mt-12 space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden rounded-2xl">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-right"
                >
                  <span className="font-medium text-cream-100">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gold-400 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-cream-300/60 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <CalendarHeart className="mx-auto mb-6 h-16 w-16 text-gold-400" />
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream-100">
            ابدأ رحلتك مع <span className="text-gold-400">الدعوات الفاخرة</span>
          </h2>
          <p className="mt-4 text-cream-300/60">
            اختر قالبك المفضل واطلبه الآن — الدفع كاش بالليرة السورية
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate('/templates')}
              className="btn-gold flex items-center gap-2 rounded-xl px-8 py-4 text-base"
            >
              <Palette className="h-5 w-5" />
              تصفح القوالب
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold flex items-center gap-2 rounded-xl px-8 py-4 text-base"
            >
              <MessageCircle className="h-5 w-5" />
              تواصل معنا
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
