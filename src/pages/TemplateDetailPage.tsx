import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Star, MessageCircle, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import TemplatePreview from '../components/TemplatePreview';
import { getTemplate } from '../data/templates';
import { formatPrice, WHATSAPP_NUMBER } from '../types';

export default function TemplateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const template = id ? getTemplate(id) : undefined;

  if (!template) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Navbar />
        <WhatsAppButton />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <Sparkles className="mb-4 h-16 w-16 text-gold-500/40" />
          <h1 className="font-serif text-3xl text-cream-100">القالب غير موجود</h1>
          <button onClick={() => navigate('/templates')} className="btn-outline-gold mt-8 rounded-xl px-6 py-3 text-sm">
            العودة للقوالب
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <WhatsAppButton />

      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate('/templates')}
            className="mb-6 flex items-center gap-2 text-sm text-cream-300/60 hover:text-gold-400 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للقوالب
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Preview */}
            <div>
              <TemplatePreview
                template={template}
                title="اسم المناسبة الخاص بك"
                hostName="اسم المضيف"
                eventDate="يوم، تاريخ المناسبة"
                venue="اسم القاعة · المدينة"
              />

              <div className="mt-6 glass-card rounded-2xl p-6">
                <h3 className="mb-4 font-serif text-lg font-semibold text-cream-100">ألوان القالب</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full border border-gold-500/20" style={{ backgroundColor: template.preview.bg }} />
                    <span className="text-xs text-cream-300/50">الخلفية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full border border-gold-500/20" style={{ backgroundColor: template.preview.accent }} />
                    <span className="text-xs text-cream-300/50">اللون المميز</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full border border-gold-500/20" style={{ backgroundColor: template.preview.text }} />
                    <span className="text-xs text-cream-300/50">النص</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl font-semibold text-cream-100">{template.name}</h1>
                {template.popular && (
                  <span className="flex items-center gap-1 rounded-full bg-gold-500/10 px-3 py-1 text-xs text-gold-400">
                    <Star className="h-3 w-3 fill-gold-400" />
                    الأكثر طلباً
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gold-400">{template.nameEn}</p>
              <p className="mt-4 text-cream-300/70 leading-relaxed">{template.description}</p>

              <div className="mt-6">
                <span className="font-serif text-4xl font-semibold text-gold-400">
                  {formatPrice(template.price)}
                </span>
                <p className="mt-1 text-xs text-cream-300/40">يبدأ من هذا السعر — الدفع كاش بالليرة السورية</p>
              </div>

              <div className="mt-8 glass-card rounded-2xl p-6">
                <h3 className="mb-4 font-serif text-lg font-semibold text-cream-100">مميزات القالب</h3>
                <div className="space-y-3">
                  {template.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-cream-300/70">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate(`/order?template=${template.id}`)}
                  className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold"
                >
                  اطلب هذا القالب
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أرغب في الاستفسار عن قالب "${template.name}"`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold"
                >
                  <MessageCircle className="h-5 w-5" />
                  استفسر عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
