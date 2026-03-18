import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leader Finder – Hitman Target Identifier",
  description:
    "A fan-made iOS app to help Hitman Freelancer players identify syndicate leaders. Filter targets by hair color, accessories, and distinguishing features to find your mark fast.",
  keywords: [
    "Hitman Freelancer",
    "Hitman target finder",
    "Freelancer leader finder",
    "Hitman syndicate leaders",
    "Hitman iOS app",
    "Hitman suspect filter",
    "IO Interactive fan tool",
  ],
  metadataBase: new URL("https://leaderfinder.samwightwick.co.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Leader Finder – Hitman Target Identifier",
    description:
      "Filter Hitman Freelancer syndicate leaders by hair color, accessories, and more. Find your mark in seconds.",
    url: "https://leaderfinder.samwightwick.co.uk",
    siteName: "Leader Finder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Leader Finder – Hitman Target Identifier",
    description:
      "Filter Hitman Freelancer syndicate leaders by hair color, accessories, and more. Find your mark in seconds.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
