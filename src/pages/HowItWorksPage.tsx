import { useNavigate } from 'react-router-dom';
import { Palette, MessageCircle, Sparkles, Users, Check, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { SectionTitle } from '../components/ui';
import { WHATSAPP_NUMBER } from '../types';

export default function HowItWorksPage() {
  const navigate = useNavigate();

  const steps = [
    {
      num: '1',
      icon: <Palette className="h-8 w-8" />,
      title: 'تصفح القوالب',
      desc: 'استعرض 8 قوالب فاخرة مصممة بعناية لكل أنواع المناسبات. اختر القالب الذي يناسب أسلوبك ومناسبتك.',
      points: ['8 قوالب متنوعة', 'معاينة كاملة لكل قالب', 'فلترة حسب نوع المناسبة'],
    },
    {
      num: '2',
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'أرسل تفاصيلك',
      desc: 'اضغط "اطلب هذا القالب" واملأ النموذج بتفاصيل مناسبتك. سيتم تجهيز رسالة واتساب تلقائياً بكل التفاصيل.',
      points: ['نموذج بسيط وسريع', 'تفاصيل المناسبة كاملة', 'إرسال مباشر عبر واتساب'],
    },
    {
      num: '3',
      icon: <Sparkles className="h-8 w-8" />,
      title: 'نصمم دعوتك',
      desc: 'نتواصل معك لتأكيد التفاصيل والدفع (كاش). ثم نبدأ بتصميم دعوتك ونرسلها لك خلال 12-48 ساعة حسب الباقة.',
      points: ['تصميم احترافي', 'تعديلات حسب الباقة', 'تسليم سريع 12-48 ساعة'],
    },
    {
      num: '4',
      icon: <Users className="h-8 w-8" />,
      title: 'شارك وتابع',
      desc: 'نرسل لك رابط الدعوة الرقمية تشاركه مع ضيوفك. يفتحون الرابط ويؤكدون حضورهم بضغطة زر.',
      points: ['رابط واحد لكل الضيوف', 'نظام RSVP لتأكيد الحضور', 'مشاركة عبر واتساب ووسائل التواصل'],
    },
  ];

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <WhatsAppButton />

      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            center
            title={<>كيف <span className="text-gold-400">نعمل</span></>}
            subtitle="4 خطوات بسيطة تفصلك عن دعوتك الفاخرة"
          />

          <div className="mt-16 space-y-8">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col gap-6 md:flex-row">
                <div className="flex-shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/5">
                    <span className="font-serif text-3xl font-semibold text-gold-400">{step.num}</span>
                  </div>
                </div>
                <div className="glass-card flex-1 rounded-2xl p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-gold-400">{step.icon}</span>
                    <h3 className="font-serif text-xl font-semibold text-cream-100">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-cream-300/60">{step.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.points.map((p, j) => (
                      <span key={j} className="flex items-center gap-1 rounded-lg bg-navy-800/50 px-3 py-1.5 text-xs text-cream-300/50">
                        <Check className="h-3 w-3 text-gold-400" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="font-serif text-2xl font-light text-cream-100">
              جاهز لبدء رحلتك؟
            </h3>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate('/templates')}
                className="btn-gold flex items-center gap-2 rounded-xl px-8 py-4 text-base"
              >
                تصفح القوالب
                <ArrowLeft className="h-5 w-5" />
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
