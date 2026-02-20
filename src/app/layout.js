import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from 'next/font/google';
import './globals.css';
import AnalyticsTracker from '@/components/AnalyticsTracker';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
  display: 'swap',
});

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-zen',
  display: 'swap',
});

export const metadata = {
  title: '大陸棚居酒屋 太平洋本店 | 串かつ1本120円〜 食べ飲み放題3,500円',
  description:
    '太平洋のど真ん中にある架空の居酒屋「大陸棚居酒屋」。串かつ1本120円〜、太平洋直送の新鮮刺身、食べ飲み放題3,500円〜。マリアナ海溝ICより潜水5分。宴会・コース料理のご予約受付中。',
  keywords: ['大陸棚居酒屋', '太平洋', '串かつ', '居酒屋', '食べ放題', '飲み放題', '海鮮', '刺身', 'もつ鍋', '架空'],
  openGraph: {
    title: '大陸棚居酒屋 太平洋本店',
    description: '串かつ1本120円〜。太平洋直送の鮮魚と食べ飲み放題をご堪能ください。',
    url: 'https://tairikudana-izakaya.vercel.app',
    siteName: '大陸棚居酒屋',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '大陸棚居酒屋 太平洋本店',
    description: '串かつ1本120円〜 食べ飲み放題3,500円〜 太平洋のど真ん中で乾杯！',
  },
  verification: {
    google: 'qnVPzEq4mLYNbSFKW6VRnuPG4w5rZ70hT-WhgI4Z2Q8',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: '大陸棚居酒屋 太平洋本店',
              description: '太平洋のど真ん中にある架空の居酒屋',
              servesCuisine: ['串かつ', '居酒屋', '海鮮', 'もつ鍋'],
              address: {
                '@type': 'PostalAddress',
                addressLocality: '太平洋',
                streetAddress: '大陸棚海底プラザ 1F',
              },
              telephone: '0120-000-000',
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  opens: '17:00',
                  closes: '02:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Sunday',
                  opens: '17:00',
                  closes: '00:00',
                },
              ],
              priceRange: '¥1,000〜¥4,000',
            }),
          }}
        />
      </head>
      <body className={`${notoSansJp.variable} ${zenKaku.variable}`}>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
