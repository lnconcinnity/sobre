"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "../modules/gsap";
import { Workflow, CircleArrowDown } from "lucide-react";

export default function ProcessHeader() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        gsap.fromTo(".kinetic-node", 
            { 
                y: 35, 
                opacity: 0 
            },
            { 
                y: 0, 
                opacity: 1, 
                stagger: 0.12, 
                duration: 1, 
                ease: "power4.out", 
                scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <div 
            ref={containerRef}
            className="relative z-20 mt-4 mb-10 px-4 sm:px-6 flex flex-col items-center select-none"
        >
            <div className="relative px-4 py-10 sm:p-14 text-center max-w-5xl w-full rounded-4xl md:rounded-[3rem] overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                <div className="relative z-10 flex flex-col items-center">
                    <span className="kinetic-node inline-flex items-center gap-2 text-mint-dark font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-3">
                        <Workflow className="size-3.5 text-mint-dark animate-pulse" /> The Sobre Protocol
                    </span>
                    <p className="kinetic-node text-sm sm:text-base text-neutral-500 font-medium italic tracking-tight mb-2">
                        Your future mapped
                    </p>
                    <h2 className="kinetic-node w-full flex items-center justify-center gap-3 sm:gap-5 text-[8.5vw] lg:text-[5.5rem] uppercase text-neutral-900 font-black leading-none tracking-tighter whitespace-nowrap">
                        <span>
                            How it&apos;s <span className="italic text-transparent" style={{ WebkitTextStroke: "1.5px #171717" }}>done</span>
                        </span>
                        <CircleArrowDown strokeWidth={1} className="size-[6vw] lg:size-12 text-mint-dark shrink-0 animate-bounce" />
                    </h2>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
            </div>
        </div>
    );
}