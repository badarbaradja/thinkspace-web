import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThinkSpace — Temukan Workspace Ideal di Coffee Shop",
  description:
    "ThinkSpace menghubungkan pekerja remote, freelancer, dan startup dengan coffee shop terbaik untuk produktivitas maksimal. Temukan cafe dengan WiFi cepat, suasana nyaman, dan fasilitas lengkap.",
  keywords: [
    "workspace",
    "coffee shop",
    "remote work",
    "coworking",
    "cafe kerja",
    "Jakarta",
  ],
  openGraph: {
    title: "ThinkSpace — Temukan Workspace Ideal di Coffee Shop",
    description:
      "Temukan cafe terbaik untuk bekerja. WiFi cepat, suasana nyaman, fasilitas lengkap.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
