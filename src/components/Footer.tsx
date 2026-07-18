import { useNavigate } from 'react-router-dom';
import { Sparkles, Phone, MessageCircle, Mail } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-gold-500/10 bg-navy-950 py-12 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10">
                <Sparkles className="h-5 w-5 text-gold-400" />
              </div>
              <span className="font-serif text-xl font-semibold text-cream-100">دعوات فاخرة</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-300/50">
              منصة سورية متخصصة في تصميم الدعوات الرقمية الفاخرة لجميع المناسبات.
              نصمم لك دعوة تليق بمناسبتك وترسلها لضيوفك بضغطة زر.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg text-cream-100">روابط سريعة</h3>
            <div className="space-y-2 text-sm text-cream-300/50">
              <button onClick={() => navigate('/templates')} className="block hover:text-gold-400 transition-colors">
                القوالب
              </button>
              <button onClick={() => navigate('/pricing')} className="block hover:text-gold-400 transition-colors">
                الأسعار
              </button>
              <button onClick={() => navigate('/how-it-works')} className="block hover:text-gold-400 transition-colors">
                كيف نعمل
              </button>
              <button onClick={() => navigate('/order')} className="block hover:text-gold-400 transition-colors">
                اطلب دعوتك
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg text-cream-100">تواصل معنا</h3>
            <div className="space-y-3 text-sm text-cream-300/50">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold-400 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-gold-400" />
                واتساب: 00963993812129
              </a>
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2 hover:text-gold-400 transition-colors"
              >
                <Phone className="h-4 w-4 text-gold-400" />
                اتصال مباشر
              </a>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-400" />
                info@dawat-fakhira.sy
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gold-500/10 pt-6 text-center text-sm text-cream-300/40">
          © 2025 دعوات فاخرة — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
