"use client";

import { useRef } from "react";
import gsap, { useGSAP } from "../modules/gsap";
import InkStroke from "../components/InkStroke";
import SearchDropdown from "../components/SearchDropdown";
import { useTransition } from "../hooks/useTransition";

export default function NotFound() {
    const container = useRef(null);
    const { startTransition } = useTransition();

    useGSAP(() => {
        const paths = gsap.utils.toArray(".brush-path");
        gsap.set(paths, { drawSVG: "0%", stroke: "#87df90" });

        gsap.to(paths, {
            drawSVG: "100%",
            duration: 2.5,
            stagger: 0.15,
            ease: "power3.inOut",
        });

        gsap.from(".not-found-content > *", {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            delay: 0.5
        });
    }, { scope: container });

    const handleNav = (href: string) => {
        startTransition(href);
    };

    return (
        <main ref={container} className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-[#f9fdf9]">
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-20 -right-20 w-xl h-auto rotate-12">
                    <InkStroke className="w-full h-full" />
                </div>
                <div className="absolute -bottom-20 -left-20 w-xl h-auto -rotate-165">
                    <InkStroke className="w-full h-full" />
                </div>
            </div>

            <section className="not-found-content relative z-0 w-full max-w-2xl px-6 text-center">
                <span className="inline-block text-mint-dark font-black tracking-[0.2em] uppercase text-xs mb-4">
                    Error 404
                </span>
                
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 italic">
                    Lost your <span className="text-transparent" style={{ WebkitTextStroke: "1.5px black" }}>way?</span>
                </h1>

                <p className="text-neutral-500 max-w-md mx-auto mb-12">
                    The path you&apos;re looking for doesn&apos;t exist yet, but your future still does. Try searching for a destination.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <button 
                        onClick={() => handleNav("/")} 
                        className="magnetic group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-neutral-800 hover:cursor-pointer"
                    >
                        <span className="size-2 rounded-full bg-mint-dark group-hover:scale-150 transition-transform" />
                        Back to Home
                    </button>
                    <button 
                        onClick={() => handleNav("/forum")} 
                        className="magnetic group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-neutral-800 hover:cursor-pointer"
                    >
                        <span className="size-2 rounded-full bg-black/10 group-hover:bg-mint-dark transition-colors" />
                        Ask the Forum
                    </button>
                </div>
            </section>
        </main>
    );
}