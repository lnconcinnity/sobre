"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap, { useGSAP } from "../../modules/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const proceduresList = [
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

function ProcessSection({ proc, index }: { proc: typeof proceduresList[0], index: number }) {
    const container = useRef(null);
    const imgRef = useRef(null);

    useGSAP(() => {
        gsap.to(imgRef.current, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
        gsap.from(`.content-${index} > *`, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 70%",
            }
        });
    }, { scope: container });

    return (
        <div ref={container} className="relative h-screen w-full overflow-hidden flex items-center group">
            <div className="absolute inset-0 z-0">
                <div ref={imgRef} className="relative w-full h-[120%] -top-[10%]">
                    <Image 
                        src={proc.img} 
                        alt={proc.title} 
                        fill 
                        className="object-cover brightness-[0.4] grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" 
                    />
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-[#263127] via-[#263127]/60 to-transparent" />
            </div>
            <div className={`content-${index} relative z-10 container mx-auto px-8 md:px-28 flex flex-col justify-center`}>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-amber-600 text-6xl md:text-8xl font-thin leading-none opacity-50">
                        0{index + 1}
                    </span>
                    <div className="h-px w-12 bg-mint-dark" />
                    <span className="text-mint-light font-bold uppercase tracking-[0.3em] text-xs">
                        {proc.tag}
                    </span>
                </div>

                <h3 className="text-white text-4xl md:text-6xl font-black uppercase mb-6 max-w-2xl leading-tight">
                    {proc.title}
                </h3>
                
                <p className="text-white/60 text-lg md:text-xl max-w-md leading-relaxed mb-12">
                    {proc.description}
                </p>

                <button className="magnetic group self-start flex items-center gap-4 text-white uppercase tracking-widest text-xs font-bold border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-colors">
                    <span>Inquire Now</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function ProceduresSection() {
    return (
        <section className="relative bg-[#263127]">
            <div className="flex flex-col">
                {proceduresList.map((proc, index) => (
                    <ProcessSection key={index} proc={proc} index={index} />
                ))}
            </div>

            <div className="bg-[#f9fdf9] py-24 flex flex-col items-center justify-center text-center px-6">
                <h4 className="text-2xl md:text-4xl font-black uppercase mb-8">
                    Ready to <span className="italic text-transparent" style={{ WebkitTextStroke: "1px black" }}>pave your path?</span>
                </h4>
                <button className="magnetic px-12 py-6 bg-mint-dark text-white rounded-full font-black uppercase tracking-widest text-sm shadow-xl shadow-mint-dark/20">
                    Get Started Today
                </button>
            </div>
        </section>
    );
}