import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. تحميل متغيرات البيئة بناءً على وضع التشغيل الحالي (Production / Development)
  // الدالة تبحث في المجلد الرئيسي للعملية وتجلب المتغيرات المتاحة في النظام
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // 2. تعريف المتغيرات يدوياً لضمان حقنها بشكل صارم داخل المتصفح في Netlify
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },

    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});