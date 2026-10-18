import type { Metadata } from "next";
import { Outfit, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "../lib/config";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono-space",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const BASE_URL = "https://community.hastandart.com";

const PLATFORM_DESC =
  "Research on how people think and act, turned into simple methods you can use. Three paths: how we communicate, how we build habits, and how we make decisions. By Shani Koren.";

export const metadata: Metadata = {
  title: `${SITE.name} · Connect, Habits, Decide`,
  description: PLATFORM_DESC,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Become · a platform by Shani Koren",
    description: PLATFORM_DESC,
    url: BASE_URL,
    siteName: "Become",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Become, a platform by Shani Koren.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Become · a platform by Shani Koren",
    description: PLATFORM_DESC,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${outfit.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <head>
        <link rel="preload" as="image" href="/mountain-hero.webp" type="image/webp" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
