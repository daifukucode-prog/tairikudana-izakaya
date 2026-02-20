export default function sitemap() {
  return [
    {
      url: 'https://tairikudana-izakaya.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://tairikudana-izakaya.vercel.app/reserve',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
