import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer, Nav } from "@/components/layout";
import { LenisProvider } from "@/components/motion";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Contech — Heavy-Duty Hume Pipes for National Infrastructure",
    template: "%s — Contech",
  },
  description:
    "Precision-engineered hume pipes (NP2, NP3, NP4) for civil contractors, procurement managers, and bulk B2B buyers. ISO 9001:2015 certified.",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://contech.example/#organization",
      name: "Contech Concrete and Allied Industries",
      description:
        "Manufacturer of precision-engineered hume pipes (NP2, NP3, NP4) compliant with IS 458:2003.",
      knowsAbout: [
        "Reinforced Concrete Pipes",
        "Hume Pipes NP2",
        "Hume Pipes NP3",
        "Hume Pipes NP4",
        "IS 458:2003",
        "Stormwater Drainage",
        "Sewage Conveyance",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://contech.example/#website",
      url: "https://contech.example/",
      name: "Contech",
      publisher: { "@id": "https://contech.example/#organization" },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <LenisProvider>
          <Nav />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
