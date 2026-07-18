import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import TemplatePreview from '../components/TemplatePreview';
import SEO from '../components/SEO';
import { SectionTitle } from '../components/ui';
import { TEMPLATES } from '../data/templates';
import { EVENT_TYPES, formatPrice, type EventType } from '../types';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<EventType | 'all'>('all');

  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  const filterOptions: { value: EventType | 'all'; label: string }[] = [
    { value: 'all', label: 'الكل' },
    ...EVENT_TYPES.map((t) => ({ value: t.value, label: t.label })),
  ];

  return (
    <div className="min-h-screen bg-navy-900">
      <SEO title="معرض القوالب" description="8 قوالب دعوات رقمية فاخرة — اختر قالبك واطلبه مباشرة عبر واتساب" />
      <Navbar />
      <WhatsAppButton />

      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            center
            title={<>معرض <span className="text-gold-400">القوالب</span></>}
            subtitle="8 قوالب فاخرة مصممة بعناية — اختر قالبك واطلبه مباشرة عبر واتساب"
          />

          {/* Filters */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`rounded-xl px-4 py-2.5 text-sm transition-all ${
                  filter === opt.value
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30'
                    : 'text-cream-300/60 hover:text-cream-100 border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <div key={template.id} className="group">
                <div
                  onClick={() => navigate(`/templates/${template.id}`)}
                  className="cursor-pointer"
                >
                  <TemplatePreview template={template} className="transition-transform group-hover:scale-105" />
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-semibold text-cream-100">{template.name}</h3>
                    {template.popular && (
                      <span className="flex items-center gap-1 rounded-full bg-gold-500/10 px-2.5 py-1 text-xs text-gold-400">
                        <Star className="h-3 w-3 fill-gold-400" />
                        الأكثر طلباً
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-cream-300/60">{template.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {template.features.map((feat, i) => (
                      <span key={i} className="flex items-center gap-1 rounded-lg bg-navy-800/50 px-2.5 py-1 text-xs text-cream-300/50">
                        <Check className="h-3 w-3 text-gold-400" />
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-serif text-2xl font-semibold text-gold-400">
                      {formatPrice(template.price)}
                    </span>
                    <button
                      onClick={() => navigate(`/order?template=${template.id}`)}
                      className="btn-gold flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
                    >
                      اطلب هذا القالب
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-cream-300/50">
              لا توجد قوالب في هذا التصنيف حالياً
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
