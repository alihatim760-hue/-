import { useNavigate } from 'react-router-dom';
import { Check, MessageCircle, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { SectionTitle } from '../components/ui';
import { PRICING_PACKAGES, formatPrice, WHATSAPP_NUMBER } from '../types';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <WhatsAppButton />

      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            center
            title={<>باقات <span className="text-gold-400">الأسعار</span></>}
            subtitle="أسعار بالليرة السورية — الدفع كاش (نقداً) بعد تأكيد الطلب"
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

          {/* Custom pricing note */}
          <div className="mt-12 glass-card rounded-2xl p-8 text-center">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-gold-400" />
            <h3 className="font-serif text-xl font-semibold text-cream-100">تحتاج تصميماً مخصصاً؟</h3>
            <p className="mt-2 text-sm text-cream-300/60">
              نقدم تصاميم حصرية من الصفر حسب طلبك — تواصل معنا عبر واتساب لمناقشة التفاصيل
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب في تصميم دعوة مخصص حصري')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل معنا
            </a>
          </div>

          <p className="mt-8 text-center text-sm text-cream-300/40">
            * الأسعار قابلة للتفاوض حسب متطلبات المناسبة — جميع الأسعار بالليرة السورية (ل.س)
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
