export type EventType =
  | 'wedding'
  | 'engagement'
  | 'birthday'
  | 'corporate'
  | 'graduation'
  | 'other';

export type PackageType = 'basic' | 'standard' | 'luxury';

export type InquiryStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

export type EventStatus = 'draft' | 'published' | 'archived';

export type RSVPStatus = 'pending' | 'attending' | 'maybe' | 'declined';

export interface Inquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  event_type: EventType;
  event_date: string | null;
  event_time: string;
  venue: string;
  template_id: string;
  package_type: PackageType;
  guest_count: number;
  notes: string;
  status: InquiryStatus;
  created_at: string;
}

export interface TemplatePreview {
  bg: string;
  accent: string;
  text: string;
  pattern: 'arabesque' | 'minimal' | 'floral' | 'geometric' | 'classic' | 'royal';
}

export interface InvitationTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: EventType | 'all';
  price: number;
  preview: TemplatePreview;
  features: string[];
  popular?: boolean;
}

export interface PricingPackage {
  id: PackageType;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface InvitationEvent {
  id: string;
  user_id: string;
  title: string;
  host_name: string;
  event_type: EventType;
  event_date: string | null;
  event_time: string;
  venue: string;
  template_id: string;
  package_type: PackageType;
  cover_image_url: string;
  status: EventStatus;
  invitation_slug: string | null;
  notes: string;
  max_guests: number;
  allow_plus_ones: boolean;
  rsvp_deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  plus_ones: number;
  rsvp_status: RSVPStatus;
  rsvp_message: string;
  rsvp_at: string | null;
  created_at: string;
}

export const WHATSAPP_NUMBER = '963993812129';

export const EVENT_TYPES: { value: EventType; label: string; labelEn: string }[] = [
  { value: 'wedding', label: 'زفاف', labelEn: 'Wedding' },
  { value: 'engagement', label: 'خطوبة', labelEn: 'Engagement' },
  { value: 'birthday', label: 'عيد ميلاد', labelEn: 'Birthday' },
  { value: 'corporate', label: 'مناسبة شركة', labelEn: 'Corporate' },
  { value: 'graduation', label: 'تخرج', labelEn: 'Graduation' },
  { value: 'other', label: 'أخرى', labelEn: 'Other' },
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'basic',
    name: 'الباقة الأساسية',
    price: 50000,
    description: 'مثالية للمناسبات الصغيرة والبسيطة',
    features: [
      'قالب جاهز (اختيار من 3 قوالب)',
      'تصميم دعوة رقمية واحدة',
      'رابط مشاركة واحد',
      'تتبع الردود (RSVP)',
      'تعديلين مجانيين',
      'التسليم خلال 48 ساعة',
    ],
  },
  {
    id: 'standard',
    name: 'الباقة المتوسطة',
    price: 150000,
    description: 'الخيار الأكثر شعبية للمناسبات المميزة',
    popular: true,
    features: [
      'اختيار من جميع القوالب (8 قوالب)',
      'تصميم دعوة رقمية مخصص',
      'ألوان وخطوط قابلة للتخصيص',
      'رابط مشاركة + QR Code',
      'تتبع الردود (RSVP) + تذكيرات',
      'صورة غلاف مخصصة',
      'تعديلات غير محدودة',
      'التسليم خلال 24 ساعة',
    ],
  },
  {
    id: 'luxury',
    name: 'الباقة الفاخرة',
    price: 400000,
    description: 'تجربة فاخرة كاملة لمناسباتك الراقية',
    features: [
      'تصميم حصري من الصفر',
      'قوالب فاخرة مخصصة بالكامل',
      'ألوان وخطوط وتخطيط مخصص',
      'رابط + QR Code + خريطة الموقع',
      'تتبع RSVP + تذكيرات تلقائية',
      'صورة غلاف احترافية',
      'عدّاد تنازلي حي',
      'مشاركة على وسائل التواصل',
      'دعم ذو أولوية عبر واتساب',
      'تعديلات غير محدودة + تصدير PDF',
      'التسليم خلال 12 ساعة',
    ],
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-SY').format(price) + ' ل.س';
}

export function getEventTypeLabel(value: EventType): string {
  return EVENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function generateSlug(): string {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
}
