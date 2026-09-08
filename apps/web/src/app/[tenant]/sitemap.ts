import type { MetadataRoute } from 'next';

export default function sitemap({ params }: { params: { tenant: string } }): MetadataRoute.Sitemap {
  const baseUrl = `https://${params.tenant}.apexvet.com`;

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/appointments`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];
}
