import { MessageCircle, Phone, MapPin, Clock, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { SectionTitle } from '../components/ui';
import { WHATSAPP_NUMBER } from '../types';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <WhatsAppButton />

      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            center
            title={<>تواصل <span className="text-gold-400">معنا</span></>}
            subtitle="نحن هنا للإجابة على جميع استفساراتك — تواصل معنا في أي وقت"
          />

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Contact info */}
            <div className="space-y-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group flex items-center gap-4 rounded-2xl p-6 transition-all hover:border-gold-500/30"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-cream-100">واتساب</h3>
                  <p className="text-sm text-cream-300/50" dir="ltr">00963993812129</p>
                </div>
              </a>

              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="glass-card group flex items-center gap-4 rounded-2xl p-6 transition-all hover:border-gold-500/30"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                  <Phone className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-cream-100">اتصال مباشر</h3>
                  <p className="text-sm text-cream-300/50" dir="ltr">+963 993 812 129</p>
                </div>
              </a>

              <div className="glass-card flex items-center gap-4 rounded-2xl p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                  <MapPin className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-cream-100">الموقع</h3>
                  <p className="text-sm text-cream-300/50">سوريا</p>
                </div>
              </div>

              <div className="glass-card flex items-center gap-4 rounded-2xl p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                  <Clock className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-cream-100">أوقات العمل</h3>
                  <p className="text-sm text-cream-300/50">السبت - الخميس: 9 صباحاً - 10 مساءً</p>
                  <p className="text-sm text-cream-300/50">الجمعة: 2 ظهراً - 10 مساءً</p>
                </div>
              </div>
            </div>

            {/* Quick message */}
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h3 className="mb-6 font-serif text-xl font-semibold text-cream-100">أرسل رسالة سريعة</h3>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب في الاستفسار عن خدمات الدعوات الرقمية الفاخرة')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold"
              >
                <Send className="h-5 w-5" />
                فتح محادثة واتساب
              </a>

              <div className="mt-6 space-y-3 text-sm text-cream-300/60">
                <p className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
                  نرد على جميع الرسائل خلال ساعة واحدة في أوقات العمل
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
                  يمكنك إرسال صور مرجعية للتصميم الذي تريده
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
                  الدفع كاش (نقداً) بالليرة السورية بعد تأكيد الطلب
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
                  التسليم خلال 12-48 ساعة حسب الباقة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
