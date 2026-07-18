import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_NAME = 'دعوات فاخرة';
const DEFAULT_DESCRIPTION = 'منصة سورية متخصصة في تصميم الدعوات الرقمية الفاخرة لجميع المناسبات — اطلب دعوتك عبر واتساب والدفع كاش بالليرة السورية';
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function SEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — دعوات رقمية فاخرة`;
    const desc = description || DEFAULT_DESCRIPTION;
    const img = image || DEFAULT_IMAGE;
    const pageUrl = url || window.location.href;

    document.title = fullTitle;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [, name] = selector.match(/(\w+)="([^"]+)"/) || [];
        if (name) {
          el.setAttribute(name.includes('og:') || name.includes('twitter:') ? 'property' : 'name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:image"]', 'content', img);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:site_name"]', 'content', SITE_NAME);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('meta[name="twitter:image"]', 'content', img);
  }, [title, description, image, url]);

  return null;
}
