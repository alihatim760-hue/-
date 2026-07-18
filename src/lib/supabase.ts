import { createClient } from '@supabase/supabase-js';

// 1. محاولة قراءة المتغيرات الممررة من Vite عند بناء المشروع سحابياً
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. فحص وتصفية القيمة (للتأكد من أنها نص رابط حقيقي يبدأ بـ http وليس فارغاً أو null)
const isValidUrl = rawUrl && rawUrl !== 'undefined' && rawUrl.startsWith('http');

// 3. تعيين الرابط الفعلي: إذا كان الرابط من Netlify صالحاً نستخدمه، وإلا نستخدم الرابط الاحتياطي مؤقتاً
const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = rawKey && rawKey !== 'undefined' ? rawKey : 'placeholder-key';

// 4. طباعة الحالة في متصفح المطورين لمراقبة نجاح عملية الحقن البرمجي
console.log("الرابط الفعلي الحقيقي الممرر:", isValidUrl ? "تم الربط بنجاح بالخادم الحقيقي" : "null - يعتمد على الاحتياطي");

if (!isValidUrl) {
  console.warn("⚠️ تنبيه: إعدادات الرابط غير صالحة أو مشوهة. يرجى إعادة بناء الموقع في Netlify.");
}

// 5. تصدير عميل Supabase ليكون جاهزاً للاستخدام في كافة صفحات المنصة
export const supabase = createClient(supabaseUrl, supabaseAnonKey);