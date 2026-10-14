import type { Metadata, Viewport } from "next";
import "./globals.css";
import { profile, seo, socialLinks } from "@/data/profile";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import CookieConsent from "@/components/CookieConsent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ankitvishwakarma.dev";

/** Existing on-site asset suitable for social previews (profile headshot). */
const ogImagePath = "/images/profile-photo.jpg";

const themeInitScript = `(function(){try{var k='portfolio-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.colorScheme='dark';}})();`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6F0" },
    { media: "(prefers-color-scheme: dark)", color: "#08080A" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.metaTitle,
    template: `%s | ${profile.fullName}`,
  },
  description: seo.metaDescription,
  keywords: seo.keywords.split(",").map((k) => k.trim()),
  authors: [{ name: profile.fullName }],
  creator: profile.fullName,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: seo.title,
    description: seo.description,
    siteName: seo.siteTitle,
    locale: "en_US",
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 1200,
        alt: profile.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [ogImagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  jobTitle: profile.headline,
  description: profile.shortBio,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: siteUrl,
  image: `${siteUrl}${ogImagePath}`,
  sameAs: socialLinks.map((link) => link.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Preloader />
          <SmoothScroll />
          <CustomCursor />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
