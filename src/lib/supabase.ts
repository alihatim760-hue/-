import { createClient } from '@supabase/supabase-js';

// 1. استخراج المتغيرات مباشرة من بيئة تشغيل Vite السحابية
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. طباعة فحص أمان البيانات في متصفح المطورين للتأكد من وصول القيم
console.log("حالة رابط قاعدة البيانات الممرر:", supabaseUrl ? "✅ متوفر ويتم الحقن" : "❌ null أو غير مقروء");
console.log("حالة مفتاح الأمان الممرر:", supabaseAnonKey ? "✅ متوفر ويتم الحقن" : "❌ null أو غير مقروء");

// 3. التحقق البرمجي الإلزامي: إذا كانت المتغيرات مفقودة، يتم إطلاق تنبيه واضح للمطور
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "🚨 خطأ إعدادات: متغيرات البيئة الخاصة بـ Supabase مفقودة تماماً! " +
    "يرجى التحقق من حفظها في لوحة تحكم Netlify وإعادة بناء المشروع."
  );
}

// 4. إنشاء وتصدير عميل الاتصال الحقيقي بقاعدة البيانات
// ملاحظة: إذا كانت القيم فارغة، سيتم تمرير نصوص فارغة لتجنب انهيار التطبيق ومراقبة الخطأ بدقة
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');