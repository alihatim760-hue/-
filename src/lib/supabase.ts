import { createClient } from '@supabase/supabase-js';

// 1. جلب رابط مشروع سوبابيس السحابي ومفتاح الأمان العام من ملف البيئة (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. فحص أمني صارم للتأكد من أن المتغيرات تم قراءتها بنجاح لتجنب انهيار التطبيق عند النشر
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'خطأ برميجي: متغيرات البيئة لـ Supabase مفقودة! تأكد من إعداد ملف .env بشكل صحيح.'
  );
}

// 3. إنشاء وتصدير عميل سوبابيس (Supabase Client) مع إعدادات حفظ الجلسة وتحديثها تلقائياً
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // حفظ تسجيل دخول المستخدم حتى لو أغلق المتصفح
    autoRefreshToken: true,    // تحديث صلاحية تسجيل الدخول تلقائياً في الخلفية
    detectSessionInUrl: true,  // رصد روابط تأكيد الحساب تلقائياً في المتصفح
  },
});