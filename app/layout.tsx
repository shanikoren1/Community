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

export const metadata: Metadata = {
  title: `${SITE.name}. ${SITE.tagline}`,
  description:
    "Become the person who lives your goals. A community built on Atomic Habits: choose your identity, pick two habits, and show up every day, together.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: `Become. ${SITE.tagline}`,
    description:
      "A community for people who want to stop 'trying' and just start being. Two habits. Three weeks. Every day, together.",
    url: BASE_URL,
    siteName: "Become",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Become — The best time is now.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Become. ${SITE.tagline}`,
    description:
      "A community for people who want to stop 'trying' and just start being. Two habits. Three weeks. Every day, together.",
    images: ["/og-image.png"],
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
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
