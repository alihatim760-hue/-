import { createClient } from '@supabase/supabase-js';

// 1. جلب قيم روابط ومفاتيح سوبابيس من بيئة التشغيل
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. فحص برميجي للتأكد من أن القيم تم قراءتها بنجاح
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ تنبيه برميجي: لم يتم العثور على متغيرات البيئة الخاصة بـ Supabase بشكل صحيح في بيئة الإنتاج."
  );
}

// 3. إنشاء عميل الاتصال مع وضع قيم احتياطية لتفادي خطأ الانهيار (Must be a valid HTTP or HTTPS URL)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url-for-netlify.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);