import { type ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500"
      style={{ width: size, height: size }}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={48} />
        <p className="font-serif text-lg text-gold-400">جاري التحميل...</p>
      </div>
    </div>
  );
}

export function Badge({
  children,
  color = 'gold',
}: {
  children: ReactNode;
  color?: 'gold' | 'green' | 'red' | 'amber' | 'blue';
}) {
  const colors: Record<string, string> = {
    gold: 'bg-gold-500/15 text-gold-400 border-gold-500/30',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    red: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  title,
  subtitle,
  center = false,
}: {
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'text-center' : ''}>
      <h2 className="font-serif text-3xl md:text-5xl font-light text-cream-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-cream-300/60 text-sm md:text-base max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className={`mt-4 flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <div className="h-px w-12 bg-gold-500" />
        <Sparkles className="h-4 w-4 text-gold-400" />
        <div className="h-px w-12 bg-gold-500" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
        {icon}
      </div>
      <h3 className="font-serif text-2xl text-cream-100">{title}</h3>
      <p className="mt-2 max-w-md text-cream-300/60">{description}</p>
    </div>
  );
}
