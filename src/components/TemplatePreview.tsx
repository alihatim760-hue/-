import { Sparkles, MapPin, Calendar } from 'lucide-react';
import type { InvitationTemplate } from '../types';

interface Props {
  template: InvitationTemplate;
  title?: string;
  hostName?: string;
  eventDate?: string;
  venue?: string;
  className?: string;
}

export default function TemplatePreview({
  template,
  title = 'اسم المناسبة',
  hostName = 'اسم المضيف',
  eventDate,
  venue,
  className = '',
}: Props) {
  const { bg, accent, text, pattern } = template.preview;

  const patternBg = () => {
    switch (pattern) {
      case 'arabesque':
        return {
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accent}15 1px, transparent 1px), radial-gradient(circle at 0% 0%, ${accent}10 1px, transparent 1px)`,
          backgroundSize: '24px 24px, 48px 48px',
        };
      case 'floral':
        return {
          backgroundImage: `radial-gradient(ellipse at 20% 80%, ${accent}12 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${accent}12 0%, transparent 50%)`,
        };
      case 'geometric':
        return {
          backgroundImage: `linear-gradient(45deg, ${accent}08 25%, transparent 25%), linear-gradient(-45deg, ${accent}08 25%, transparent 25%)`,
          backgroundSize: '20px 20px',
        };
      case 'minimal':
        return {};
      case 'royal':
        return {
          backgroundImage: `radial-gradient(circle at 50% 0%, ${accent}15 0%, transparent 70%)`,
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 ${className}`}
      style={{ borderColor: `${accent}30`, backgroundColor: bg }}
    >
      <div className="absolute inset-0 opacity-30" style={patternBg()} />

      <div className="relative px-6 py-12 text-center md:px-10 md:py-16">
        <div className="mx-auto mb-6 flex items-center justify-center gap-3">
          <div className="h-px w-12" style={{ backgroundColor: accent }} />
          <Sparkles className="h-4 w-4" style={{ color: accent }} />
          <div className="h-px w-12" style={{ backgroundColor: accent }} />
        </div>

        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: accent }}>
          You're Invited
        </p>

        <h3 className="mt-4 font-serif text-2xl font-light md:text-3xl" style={{ color: text }}>
          {title}
        </h3>

        <p className="mt-2 font-serif text-base" style={{ color: accent }}>
          {hostName}
        </p>

        {eventDate && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: `${text}99` }}>
            <Calendar className="h-3.5 w-3.5" style={{ color: accent }} />
            {eventDate}
          </div>
        )}

        {venue && (
          <div className="mt-1 flex items-center justify-center gap-2 text-xs" style={{ color: `${text}99` }}>
            <MapPin className="h-3.5 w-3.5" style={{ color: accent }} />
            {venue}
          </div>
        )}

        <div className="mx-auto mt-6 flex items-center justify-center gap-3">
          <div className="h-px w-12" style={{ backgroundColor: accent }} />
          <Sparkles className="h-4 w-4" style={{ color: accent }} />
          <div className="h-px w-12" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </div>
  );
}
