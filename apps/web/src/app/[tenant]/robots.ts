import type { MetadataRoute } from 'next';

export default function robots({ params }: { params: { tenant: string } }): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/checkout', '/orders', '/api/'] },
    sitemap: `https://${params.tenant}.apexvet.com/sitemap.xml`,
  };
}
