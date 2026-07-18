import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب في الاستفسار عن الدعوات الرقمية الفاخرة')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-7 w-7 text-white" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </span>
    </a>
  );
}
