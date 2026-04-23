import "./globals.css"
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroller from "../components/SmoothScroller";
import BlobCursor from "../components/BlobCursor";
import Navbar from "../components/Navbar";
import TransitionProvider from "../providers/TransitionProvider";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sobre",
    description: "A holistic educational consultancy and institutional offshoring to empower both students and institutions.",
    icons: { icon: "/favicon.ico" }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="overscroll-none no-scrollbar">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden no-scrollbar select-none bg-[#f9fdf9]`}>
                <TransitionProvider>
                    <BlobCursor />
                    <Navbar />
                    <SmoothScroller>
                        {children}
                        <Footer />
                    </SmoothScroller>
                </TransitionProvider>
            </body>
        </html>
    );
}