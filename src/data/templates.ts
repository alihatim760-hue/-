import type { InvitationTemplate } from '../types';

export const TEMPLATES: InvitationTemplate[] = [
  {
    id: 'royal-gold',
    name: 'الذهبي الملكي',
    nameEn: 'Royal Gold',
    description: 'تصميم فاخر بلمسات ذهبية وزخارف عربية أصيلة',
    category: 'wedding',
    price: 150000,
    preview: { bg: '#0f1a2e', accent: '#c5a55a', text: '#faf6ef', pattern: 'arabesque' },
    features: ['زخارف عربية', 'ألوان ذهبية', 'خط كلاسيكي', 'أناقة ملكية'],
    popular: true,
  },
  {
    id: 'ivory-rose',
    name: 'العاجي الوردي',
    nameEn: 'Ivory Rose',
    description: 'أناقة ناعمة بألوان العاج والورود للمناسبات الرومانسية',
    category: 'wedding',
    price: 150000,
    preview: { bg: '#faf6ef', accent: '#c99a9e', text: '#3a2e2e', pattern: 'floral' },
    features: ['ألوان عاجية', 'لمسات وردية', 'تصميم رومانسي', 'خط ناعم'],
  },
  {
    id: 'emerald-luxe',
    name: 'الزمردي الفاخر',
    nameEn: 'Emerald Luxe',
    description: 'فخامة الزمرد بتفاصيل ذهبية للمناسبات الراقية',
    category: 'wedding',
    price: 200000,
    preview: { bg: '#0a2e26', accent: '#d4af37', text: '#f0f0e8', pattern: 'arabesque' },
    features: ['ألوان زمردي', 'تفاصيل ذهبية', 'زخارف إسلامية', 'فخامة استثنائية'],
  },
  {
    id: 'midnight-blue',
    name: 'الأزرق الليلي',
    nameEn: 'Midnight Blue',
    description: 'هدوء الليل الأزرق بلمسات فضية للمناسبات الرسمية',
    category: 'corporate',
    price: 150000,
    preview: { bg: '#0a1628', accent: '#a8b8c8', text: '#e8eef5', pattern: 'geometric' },
    features: ['ألوان ليلية', 'لمسات فضية', 'تصميم رسمي', 'هندسة حديثة'],
  },
  {
    id: 'blush-champagne',
    name: 'الشمبانيا الوردي',
    nameEn: 'Blush Champagne',
    description: 'رومانسية الشمبانيا بألوان دافئة للمناسبات السعيدة',
    category: 'birthday',
    price: 100000,
    preview: { bg: '#f5e6d3', accent: '#c8856b', text: '#4a3a30', pattern: 'floral' },
    features: ['ألوان دافئة', 'لمسات شمبانيا', 'تصميم مرح', 'خط عصري'],
    popular: true,
  },
  {
    id: 'classic-black',
    name: 'الأسود الكلاسيكي',
    nameEn: 'Classic Black',
    description: 'بساطة سوداء بتفاصيل ذهبية للمناسبات الرسمية',
    category: 'corporate',
    price: 150000,
    preview: { bg: '#0a0a0a', accent: '#c5a55a', text: '#f5f5f5', pattern: 'minimal' },
    features: ['أسود فاخر', 'تفاصيل ذهبية', 'تصميم بسيط', 'أناقة خالدة'],
  },
  {
    id: 'royal-purple',
    name: 'البنفسجي الملكي',
    nameEn: 'Royal Purple',
    description: 'فخامة بنفسجية بلمسات ذهبية للمناسبات المميزة',
    category: 'engagement',
    price: 180000,
    preview: { bg: '#1a0a2e', accent: '#d4af37', text: '#f0e8f5', pattern: 'royal' },
    features: ['ألوان بنفسجية', 'تفاصيل ذهبية', 'تصميم ملكي', 'فخامة استثنائية'],
  },
  {
    id: 'sage-garden',
    name: 'حديقة المريمية',
    nameEn: 'Sage Garden',
    description: 'هدوء الطبيعة بألوان المريمية الخضراء للمناسبات النهارية',
    category: 'birthday',
    price: 100000,
    preview: { bg: '#e8ede0', accent: '#7a9e7e', text: '#2e3a30', pattern: 'floral' },
    features: ['ألوان طبيعية', 'لمسات خضراء', 'تصميم نهاري', 'هدوء وأناقة'],
  },
];

export function getTemplate(id: string): InvitationTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): InvitationTemplate[] {
  if (category === 'all') return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === category);
}
