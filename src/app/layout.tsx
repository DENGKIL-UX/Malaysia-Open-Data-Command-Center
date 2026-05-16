import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Malaysia Data Command Center — Powered by data.gov.my",
  description: "Premium SaaS-grade intelligence dashboard powered by data.gov.my open data. 287+ datasets across 18 categories covering demography, economy, healthcare, environment, and more.",
  keywords: ["Malaysia", "data.gov.my", "open data", "dashboard", "command center", "DOSM", "GDP", "population", "analytics"],
  authors: [{ name: "Malaysia Data Command Center" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Malaysia Data Command Center",
    description: "Premium SaaS-grade intelligence dashboard powered by data.gov.my open data",
    siteName: "Malaysia Data Command Center",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Malaysia Data Command Center",
    description: "Premium SaaS-grade intelligence dashboard powered by data.gov.my open data",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
