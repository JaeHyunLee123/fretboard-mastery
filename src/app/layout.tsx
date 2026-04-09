import type { Metadata } from "next";
import { Manrope, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fretboard Master",
  description: "Practice guitar and bass fretboard mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${spaceGrotesk.variable} dark h-full antialiased`}
    >
      <body className="font-body flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
