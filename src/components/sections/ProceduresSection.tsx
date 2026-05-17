"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap, { useGSAP } from "../../modules/gsap";
import { useTransition } from "@/src/hooks/useTransition";
import { ArrowRight } from "lucide-react";

interface ProcedureItem {
    title: string;
    tag: string;
    description: string;
    img: string;
}

const proceduresList: ProcedureItem[] = [
    {
        title: "Holistic Consultation",
        tag: "Personalization",
        description: "Receive professional guidance to map out your academic future, ensuring every decision is backed by verified data rather than information overload.",
        img: "/hd/pexels-mart-production-7223026.jpg",
    },
    {
        title: "Worry-free Processes",
        tag: "Optimization",
        description: "Experience simplified application entries for institutions. We handle the complexity of local requirements so you can focus on your goals.",
        img: "/hd/pexels-expressivestanley-1454360.jpg",
    },
    {
        title: "Path Guided and Paved",
        tag: "Efficacy",
        description: "Be equipped with readied profiles and essential tools. We bridge the gap between choice and enrollment through our institutional network.",
        img: "/hd/pexels-kindelmedia-7688190.jpg",
    },
];

interface ProcessSectionProps {
    proc: ProcedureItem;
    index: number;
}

function ProcessSection({ proc, index }: ProcessSectionProps) {
    const container = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);
    const textWrapperRef = useRef<HTMLDivElement>(null);
    const { startTransition } = useTransition();

    useGSAP(() => {
        if (!container.current || !imgRef.current || !textWrapperRef.current) return;
        gsap.to(imgRef.current, {
            y: "15%",
            ease: "none",
            force3D: true,
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
            },
        });
        gsap.from(textWrapperRef.current.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            force3D: true,
            scrollTrigger: {
                trigger: container.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
        });
    }, { scope: container });

    return (
        <div 
            ref={container} 
            className="relative min-h-screen md:h-screen w-full overflow-hidden flex items-center py-16 md:py-0"
        >
            <div className="absolute inset-0 z-0">
                <div ref={imgRef} className="relative w-full h-[120%] -top-[10%]" style={{ 
                    willChange: "transform",
                    transform: "translateZ(0)" 
                }}>
                    <Image 
                        src={proc.img} 
                        alt={proc.title} 
                        fill
                        sizes="100vw"
                        data-speed="auto"
                        priority={index === 0}
                        className="object-cover brightness-[0.4] grayscale-[0.3]" 
                    />
                </div>
                <div className="absolute inset-0 bg-linear-to-b md:bg-linear-to-r from-[#263127]/90 via-[#263127]/70 to-[#263127]/40 md:from-[#263127] md:via-[#263127]/60 md:to-transparent" />
            </div>
            <div 
                ref={textWrapperRef}
                className="relative z-10 container mx-auto px-6 sm:px-12 md:px-28 flex flex-col justify-center"
            >
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <span className="text-amber-600 text-5xl sm:text-6xl md:text-8xl font-thin leading-none opacity-50 select-none">
                        0{index + 1}
                    </span>
                    <div className="h-px w-8 md:w-12 bg-mint-dark" />
                    <span className="text-mint-light font-bold uppercase tracking-[0.25em] md:tracking-[0.3em] text-[10px] sm:text-xs">
                        {proc.tag}
                    </span>
                </div>
                <h3 className="text-white text-3xl sm:text-4xl md:text-6xl font-black uppercase mb-4 md:mb-6 max-w-2xl leading-tight">
                    {proc.title}
                </h3>
                <p className="text-white/70 md:text-white/60 text-base sm:text-lg md:text-xl max-w-md leading-relaxed mb-8 md:mb-12">
                    {proc.description}
                </p>
                <button 
                    onClick={() => startTransition("/contact")} 
                    className="cursor-pointer magnetic group self-start flex items-center gap-4 text-white uppercase tracking-widest text-[10px] sm:text-xs font-bold border border-white/20 px-6 py-3 sm:px-8 sm:py-4 rounded-full hover:bg-white hover:text-black transition-colors"
                >
                    <span>Inquire Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </button>
            </div>
        </div>
    );
}

export default function ProceduresSection() {
    const { startTransition } = useTransition();

    return (
        <section className="relative bg-[#263127]">
            <div className="flex flex-col">
                {proceduresList.map((proc, index) => (
                    <ProcessSection key={index} proc={proc} index={index} />
                ))}
            </div>
            <div className="bg-[#f9fdf9] py-24 flex flex-col items-center justify-center text-center px-6">
                <h4 className="text-2xl md:text-4xl font-black uppercase mb-8 text-black">
                    Ready to <span className="italic text-transparent" style={{ WebkitTextStroke: "1px black" }}>pave your path?</span>
                </h4>
                <button 
                    onClick={() => startTransition("/contact")} 
                    className="magnetic cursor-pointer px-12 py-6 bg-mint-dark text-white rounded-full font-black uppercase tracking-widest text-sm shadow-xl shadow-mint-dark/20 transition-colors"
                >
                    Get Started Today
                </button>
            </div>
        </section>
    );
}