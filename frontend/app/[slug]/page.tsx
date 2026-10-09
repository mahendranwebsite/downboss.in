import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SEO_PAGES } from '@/lib/seoData';
import PlatformLandingClient from './PlatformLandingClient';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(SEO_PAGES).map((slug) => ({
    slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = SEO_PAGES[params.slug];
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://downboss.in/${page.slug}`
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `https://downboss.in/${page.slug}`,
      type: 'website'
    }
  };
}

export default function PlatformLandingPage({ params }: Props) {
  const pageData = SEO_PAGES[params.slug];
  if (!pageData) {
    notFound();
  }

  return <PlatformLandingClient pageData={pageData} />;
}
