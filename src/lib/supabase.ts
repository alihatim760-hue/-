import { createClient } from '@supabase/supabase-js';

// 1. جلب القيم الخام من بيئة تشغيل Vite
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 2. معالجة برمجية لتنظيف النصوص من علامات التنصيص والفراغات الزائدة
const supabaseUrl = rawUrl.replace(/['"]/g, '').trim();
const supabaseAnonKey = rawKey.replace(/['"]/g, '').trim();

// 3. طباعة فحص أمان البيانات في متصفح المطورين للتأكد من وصول القيم
console.log("حالة رابط قاعدة البيانات الممرر:", supabaseUrl ? "✅ متوفر ويتم الحقن" : "❌ null أو غير مقروء");
console.log("حالة مفتاح الأمان الممرر:", supabaseAnonKey ? "✅ متوفر ويتم الحقن" : "❌ null أو غير مقروء");

// 4. فحص احترازي للتأكد من صحة الرابط بعد التنظيف
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  console.error("🚨 تنبيه برمجى: الرابط لا يبدأ بـ http أو https! القيمة الحالية هي:", supabaseUrl);
}

// 5. إنشاء وتصدير عميل الاتصال الحقيقي بقاعدة البيانات بالقيم النظيفة
export const supabase = createClient(supabaseUrl, supabaseAnonKey);