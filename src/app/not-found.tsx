"use client";

import { useRef } from "react";
import gsap, { useGSAP } from "../modules/gsap";
import { useTransition } from "../hooks/useTransition";

export default function NotFound() {
    const container = useRef<HTMLDivElement>(null);
    const { startTransition } = useTransition();

    useGSAP(() => {
        gsap.from(".not-found-content > *", {
            y: 40,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
            delay: 0.3
        });
    }, { scope: container });

    const handleNav = (href: string) => {
        startTransition(href);
    };

    return (
        <main 
            ref={container} 
            className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#fbfdfb]"
        >
            <div 
                className="absolute inset-0 z-0 bg-architectural-grid bg-size-[4rem_4rem] opacity-40 pointer-events-none" 
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    willChange: "transform",
                    transform: "translateZ(0)"
                }}
            />
            <section className="not-found-content relative z-10 w-full max-w-3xl px-6 text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-mint-dark/20 bg-mint-dark/4 mb-8 shadow-sm backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-mint-dark animate-pulse" />
                    <span className="text-mint-dark font-mono font-bold tracking-[0.25em] uppercase text-[10px]">
                        Status Code: 404 Error
                    </span>
                </div>
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tight leading-[0.85] mb-6 select-none">
                    Lost your <br />
                    <span 
                        className="text-transparent italic font-serif font-light tracking-wide pl-2" 
                        style={{ WebkitTextStroke: "1px #111111" }}
                    >
                        way?
                    </span>
                </h1>
                <p className="text-neutral-500 max-w-md mx-auto text-sm md:text-base leading-relaxed mb-12 font-medium">
                    The path you&apos;re looking for doesn&apos;t exist yet, but your academic trajectory still does. Let&apos;s chart a clean detour.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                    <button 
                        onClick={() => handleNav("/")} 
                        className="magnetic group w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.15em] font-bold transition-colors duration-300 hover:shadow-lg hover:shadow-neutral-950/10  hover:cursor-pointer"
                    >
                        <span className="size-1.5 rounded-full bg-mint-dark group-hover:scale-125 transition-transform duration-300" />
                        Return Home
                    </button>
                    <button 
                        onClick={() => handleNav("/forum")} 
                        className="magnetic group w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-800 text-xs uppercase tracking-[0.15em] font-bold transition-colors duration-300 hover:shadow-md hover:cursor-pointer"
                    >
                        <span className="size-1.5 rounded-full bg-neutral-200 group-hover:bg-mint-dark transition-colors duration-300" />
                        Consult Forum
                    </button>
                </div>
            </section>
        </main>
    );
}