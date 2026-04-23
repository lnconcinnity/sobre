"use client";
import { useRef } from "react";
import gsap, { useGSAP } from "../modules/gsap";
import { usePathname } from "next/navigation";
import { useNavStore } from "../store/useNavStore";
import SearchDropdown from "./SearchDropdown";
import Image from "next/image";
import { useTransition } from "../hooks/useTransition";

const NAV_LINKS = [
    { label: "Company", href: "/company" },
    { label: "Resources", href: "/resources" },
    { label: "Forum", href: "/forum" },
    { label: "Careers", href: "/careers" },
];

const VALID_ROUTES = [...NAV_LINKS.map(link => link.href), "/"];

export default function Navbar() {
    const navRef = useRef(null);
    const pathname = usePathname();
    const isHeroVisible = useNavStore((state) => state.isHeroVisible);
    const shouldShow = VALID_ROUTES.includes(pathname) && (pathname !== "/" || !isHeroVisible);
    const { startTransition }= useTransition();
    useGSAP(() => {
        gsap.to(navRef.current, { 
            y: shouldShow ? 0 : -100, 
            opacity: shouldShow ? 1 : 0, 
            duration: 0.6, 
            ease: shouldShow ? "power4.out" : "power2.in",
            overwrite: "auto",
            onStart: () => {
                if (shouldShow) gsap.set(navRef.current, { pointerEvents: "auto" });
            },
            onComplete: () => {
                if (!shouldShow) gsap.set(navRef.current, { pointerEvents: "none" });
            }
        });
    }, [shouldShow, pathname]);

    const handleLink = (href: string) => {
        if (href === pathname) return;
        startTransition(href);
    }

    return (
        <nav 
            ref={navRef}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-4 px-6 py-3 rounded-full border border-black/5 bg-white/70 backdrop-blur-md shadow-sm opacity-0 -translate-y-40 pointer-events-none"
        >
            <button onClick={() => handleLink("/")} className="cursor-pointer magnetic shrink-0 size-8 overflow-hidden rounded-sm relative">
                <Image 
                    src="/favicon.ico" 
                    alt="Sobre Logo" 
                    fill
                    className="object-contain"
                />
            </button>
            <div className="flex gap-6">
                {NAV_LINKS.map((link) => (
                    <button
                        key={link.label}
                        onClick={() => handleLink(link.href)}
                        className="cursor-pointer magnetic text-xs uppercase tracking-widest text-neutral-600 hover:text-mint-dark transition-colors"
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            <SearchDropdown label="Search..." name="nav-search" variant="lean" />
        </nav>
    );
}