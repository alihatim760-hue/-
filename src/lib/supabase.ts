import { createClient } from '@supabase/supabase-js';

// 1. جلب متغيرات البيئة التي تم تكوينها في Vite و Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. توثيق الفحص: طباعة القيم في Console المتصفح عند بدء التشغيل للتأكد من وصولها (لأغراض المراقبة البرمجية)
console.log("Supabase URL initialized:", supabaseUrl ? "حاضر وبإنتظار الربط" : "فارغ تماماً");

// 3. بناء العميل بشكل مباشر مع التحقق من وجود النص البرمجي
if (!supabaseUrl) {
  throw new Error("Missing environment variable: VITE_SUPABASE_URL");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || '');