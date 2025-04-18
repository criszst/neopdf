import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeoPDF",
  description: "Neo Era of PDF - Increase your productivity with simple and secure PDF management.",
  generator: "NeoPDF",
  applicationName: "NeoPDF",
  referrer: "origin",

  robots: "index, follow, noarchive, nocache",

  authors: [{ name: "NeoPDF", url: "https://neopdf.com.br/" }],

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/neoPDF-1.png" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`
        }
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
