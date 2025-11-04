// app/metadata.ts
import type { Metadata } from "next"

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
        width: 1200,
        height: 630,
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
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
    //   { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    //   { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
}
