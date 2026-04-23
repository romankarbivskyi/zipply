import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    template: "%s | Zipply",
    default: "Zipply | Fast URL Shortener & Powerful API",
  },
  description:
    "Zipply: A brutally fast, minimal link management platform. Get started for free with our dashboard or robust API to shorten, track, and manage links at scale.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Zipply",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zipply - The Brutally Fast URL Shortener",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@zipply",
    creator: "@zipply",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-background text-foreground flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Zipply",
              url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
              description: "The Brutally Fast URL Shortener",
            }),
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
