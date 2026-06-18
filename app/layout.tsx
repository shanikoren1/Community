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

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description:
    "Become the person who lives your goals. A community built on Atomic Habits: choose your identity, pick two habits, and show up every day — together.",
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
