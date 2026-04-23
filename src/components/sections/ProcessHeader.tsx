"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "../../modules/gsap";

export default function ProcessHeader() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".glass-text", { 
            y: 20, 
            opacity: 0, 
            stagger: 0.2, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 90%",
            }
        });
    }, { scope: containerRef });

    return (
        <div 
            ref={containerRef}
            className="relative z-20 mt-3 mb-6 px-6 flex flex-col items-center"
        >
            <div className="relative px-12 py-10 text-center max-w-4xl w-full rounded-3xl overflow-hidden">
                <div className="relative z-10">
                    <span className="glass-text block text-mint-dark font-black tracking-[0.2em] uppercase text-[10px] mb-3">
                        The Sobre Protocol
                    </span>
                    <p className="glass-text text-lg sm:text-xl md:text-2xl text-neutral-600 font-medium italic">
                        Your future mapped
                    </p>
                    <h2 className="glass-text whitespace-nowrap text-4xl sm:text-6xl md:text-8xl uppercase text-neutral-900 font-black mt-2 leading-none">
                        How it&apos;s done
                    </h2>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/40 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}