import { createClient } from '@supabase/supabase-js';

// 1. جلب القيم الخام الممررة من بيئة تشغيل السيرفر
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 2. دالة برمجية ذكية لاستخراج الرابط النقي وحذف الأقواس وعلامات التنسيق
const extractCleanUrl = (urlInput: string): string => {
  // هذا التعبير يبحث عن الرابط الحقيقي الذي يبدأ بـ http أو https ويستخرجه وحده
  const urlRegex = /(https?:\/\/[^\s)\]"']+)/;
  const match = urlInput.match(urlRegex);
  
  if (match && match[0]) {
    return match[0].trim(); // إرجاع الرابط النقي بعد تنظيف الفراغات
  }
  
  // إذا لم يجد تعبيراً مطابقاً، يقوم بتنظيف النص العادي كخيار احتياطي
  return urlInput.replace(/['"()[\]]/g, '').trim();
};

// 3. تطبيق التنظيف البرمجي على الرابط والمفتاح
const supabaseUrl = extractCleanUrl(rawUrl);
const supabaseAnonKey = rawKey.replace(/['"()[\]]/g, '').trim(); // تنظيف المفتاح أيضاً من أي أقواس

// 4. طباعة فحص أمان البيانات المحدث لمراقبة القيمة بعد التنظيف البرمجي
console.log("الرابط الخام الممرر من السيرفر:", rawUrl);
console.log("الرابط النقي المستخرج برمجياً:", supabaseUrl);
console.log("حالة مفتاح الأمان بعد التنظيف:", supabaseAnonKey ? "✅ جاهز ومطهر" : "❌ فارغ");

// 5. التحقق النهائي قبل التمرير
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  console.error("🚨 خطأ فادح: فشل استخراج رابط صحيح! القيمة الحالية:", supabaseUrl);
}

// 6. تهيئة وتصدير عميل Supabase بالبيانات النقية تماماً
export const supabase = createClient(supabaseUrl, supabaseAnonKey);