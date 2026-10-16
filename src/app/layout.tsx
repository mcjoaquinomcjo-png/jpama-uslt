import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JPAMA USLT | Junior Philippine Association of Management Accountants - Sihaya",
  description:
    "Official portal of JPAMA Sihaya Chapter at the University of Saint Louis Tuguegarao. Access member registration, upcoming events, academic reviewers, and status lookup.",
  keywords: [
    "JPAMA",
    "USLT",
    "Sihaya",
    "Management Accounting",
    "CMA Philippines",
    "Bulwagang San Jacinto",
    "Tuguegarao City",
    "BSMA",
  ],
  authors: [{ name: "JPAMA USLT Chapter" }],
  openGraph: {
    title: "JPAMA USLT - Sihaya: Radiant Beginnings in Management Accounting",
    description:
      "Empowering Louisian Management Accountants through leadership, ethics, and academic excellence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#C5A059] selection:text-white">
        <NewsTicker />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
