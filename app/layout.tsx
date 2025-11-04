import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AlphaTab } from "@/lib/alpha-tab";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "GUITAR.CAT 🎸",
  description:
    "The modern guitar tablature application — crafted for shredders, by shredders. Create, upload, and explore blazing-fast tabs with style.",
  keywords: [
    "guitar",
    "tabs",
    "tablature",
    "music",
    "rock",
    "metal",
    "guitar.cat",
    "cyberpunk",
  ],
  openGraph: {
    title: "GUITAR.CAT",
    description:
      "Modern guitar tablature in style — sleek, fast, and built for players who shred.",
    url: "https://guitar.cat",
    siteName: "GUITAR.CAT",
    images: [
      {
        url: "https://guitar.cat/og.png",
        width: 1536,
        height: 1024,
        alt: "GUITAR.CAT logo with cat face and flames",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GUITAR.CAT",
    description:
      "Modern guitar tablature application — sleek, fast, and built for players who shred.",
    images: ["https://guitar.cat/og.png"],
  },
  icons: {
    icon: [
      { url: "https://guitar.cat/favicon.ico" },
    //   { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    //   { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "https://guitar.cat/apple-touch-icon.png" }],
  },
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AlphaTab />
        {children}
      </body>
    </html>
  );
}
