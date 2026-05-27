import type { Metadata } from 'next';
import './globals.css';
import { getSite } from '@/lib/content';
import ThemeInjector from '@/components/ThemeInjector';
import Cursor from '@/components/Cursor';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    metadataBase: new URL(url),
    title: {
      default: `${site.brandName} — ${site.brandTagline}`,
      template: `%s — ${site.brandName}`,
    },
    description:
      "A creative studio combining Web Development, Graphic Design, Media Management, and F&B Video Photo Production for the world's most luxurious hotels.",
    openGraph: {
      type: 'website',
      url,
      title: `${site.brandName} — ${site.brandTagline}`,
      description: 'Digital experiences, iconic stories, and timeless hospitality.',
      siteName: site.brandName,
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700&family=Italiana&family=Marcellus&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeInjector site={site} />
        <Cursor />
        <Navbar site={site} />
        <main>{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
