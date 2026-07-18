import { createClient } from '@supabase/supabase-js';

// 1. جلب القيم وتحويلها لنصوص نظيفة
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. تنظيف المتغيرات من أي قيم نصية مشوهة مثل "undefined" الناتجة عن المجمّع
const supabaseUrl = rawUrl && rawUrl !== 'undefined' && rawUrl.startsWith('http') ? rawUrl : null;
const supabaseAnonKey = rawKey && rawKey !== 'undefined' ? rawKey : null;

// 3. فحص وطباعة الحالة الحقيقية بدقة في الـ Console
console.log("الرابط الفعلي الحقيقي الممرر:", supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ تنبيه: إعدادات الرابط غير صالحة أو مشوهة.");
}

// 4. تشغيل العميل بأمان
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);