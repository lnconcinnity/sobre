import { ReactNode } from "react"
import { Metadata } from "next"

import "./globals.css"
import NavigationBar from "@/components/NavigationBar"
import SmoothScroll from "@/components/SmoothScroll"
import TransitionProvider from "@/providers/TransitionProvider"
import FooterBar from "@/components/FooterBar"

export const metadata: Metadata = {
    title: "Sobre",
    description: "Map Your Future",
    authors: [{ name: "Gian Dwayne Romero", url: "https://www.facebook.com/giandwayne.romero.3" }],
    keywords: ["Sobre", "Research", "Product"],
    icons: {
        icon: "/favicon.ico"
    }
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth overscroll-none select-none">
            <body className="bg-gray-50">
                <TransitionProvider>
                    <NavigationBar />
                    <SmoothScroll>
                        <main id="root">
                            { children }
                        </main>
                        <FooterBar />
                    </SmoothScroll>
                </TransitionProvider>
            </body>
        </html>
    )
}