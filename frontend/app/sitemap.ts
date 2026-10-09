import { MetadataRoute } from 'next';
import { SEO_PAGES } from '@/lib/seoData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://downboss.in';

  const staticRoutes = ['', '/terms', '/privacy', '/dmca', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.5
  }));

  const platformRoutes = Object.keys(SEO_PAGES).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  return [...staticRoutes, ...platformRoutes];
}
