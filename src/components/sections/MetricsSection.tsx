"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "../../modules/gsap";
import { Search, CheckCircle, MessageSquare, Sparkles, ShieldCheck, GraduationCap } from "lucide-react";

export default function MetricsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const tabletRef = useRef<HTMLDivElement>(null);
    
    const linkCounterRef = useRef<HTMLSpanElement>(null);
    const forumCounterRef = useRef<HTMLSpanElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    useGSAP(() => {
        if (!sectionRef.current || !tabletRef.current) return;
        gsap.fromTo(tabletRef.current, 
        { 
            rotateX: 35, 
            rotateY: -25, 
            z: -300, 
            opacity: 0 
        },
        {
            rotateX: 12,
            rotateY: -12,
            z: 0,
            opacity: 1,
            scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
            }
        }
        );

        if (linkCounterRef.current) {
            gsap.fromTo(linkCounterRef.current,
                { textContent: "0" },
                {
                    textContent: "100",
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 50%" },
                    snap: { textContent: 1 },
                }
            );
        }

        if (forumCounterRef.current) {
            gsap.fromTo(forumCounterRef.current,
                { textContent: "0" },
                {
                    textContent: "1250",
                    duration: 2.5,
                    ease: "power3.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 50%" },
                    snap: { textContent: 1 },
                }
            );
        }
        if (searchInputRef.current) {
            gsap.to(searchInputRef.current, {
                value: "Looking for USTET requirements...",
                duration: 2,
                delay: 0.5,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 40%",
                }
            });
        }
        gsap.from(".val-prop", {
            y: 30,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
            }
        });

        const handleMouseMove = (e: MouseEvent) => {
            const bounds = sectionRef.current?.getBoundingClientRect();
            if (!bounds) return;

            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const xPercent = (mouseX / bounds.width) - 0.5;
            const yPercent = (mouseY / bounds.height) - 0.5;

            gsap.to(tabletRef.current, {
                rotateY: -12 + (xPercent * 24),
                rotateX: 12 - (yPercent * 24),
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(tabletRef.current, {
                rotateX: 12,
                rotateY: -12,
                duration: 1,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        const sectionEl = sectionRef.current;
        sectionEl.addEventListener("mousemove", handleMouseMove);
        sectionEl.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            sectionEl.removeEventListener("mousemove", handleMouseMove);
            sectionEl.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative z-0 min-h-screen flex items-center py-16 md:py-24 bg-[#263127] overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="z-10 order-2 lg:order-1">
                    <span className="val-prop flex items-center gap-2 text-mint-light font-black tracking-widest uppercase text-xs mb-4">
                        <Sparkles className="size-4 animate-spin-slow" /> The Sobre Advantage
                    </span>
                    <h2 className="val-prop text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.95] md:leading-[0.9] mb-6 text-white">
                        Clarity over <br/>
                        <span className="italic text-transparent" style={{ WebkitTextStroke: "1.5px white" }}>Clutter.</span>
                    </h2>
                    <p className="val-prop text-white/60 max-w-md text-base sm:text-lg mb-8 leading-relaxed">
                        Choosing a university shouldn&apos;t be a guessing game. We cut through the noise by providing <strong>verified, human-backed data</strong> and personalized matching for the country&apos;s top institutions.
                    </p>
                    <div className="space-y-6 border-t border-white/10 pt-8">
                        <div className="val-prop flex gap-4 items-start">
                            <div className="shrink-0 mt-1 size-8 rounded-xl bg-mint-light/10 border border-mint-light/20 flex items-center justify-center text-mint-light">
                                <ShieldCheck className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Verified Authenticity</h3>
                                <p className="text-sm text-white/40 mt-1">No AI hallucinations. Just accurate, up-to-date program requirements and real student feedback.</p>
                            </div>
                        </div>
                        
                        <div className="val-prop flex gap-4 items-start">
                            <div className="shrink-0 mt-1 size-8 rounded-xl bg-mint-light/10 border border-mint-light/20 flex items-center justify-center text-mint-light">
                                <GraduationCap className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Optimized Placement</h3>
                                <p className="text-sm text-white/40 mt-1">Our Academic Finder maps your unique profile directly to schools where you are most likely to succeed.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="perspective-2000 py-12 lg:py-20 lg:pl-10 order-1 lg:order-2 flex items-center justify-center">
                    <div 
                        ref={tabletRef}
                        className="preserve-3d relative w-full max-w-md lg:max-w-lg aspect-3/4 md:aspect-4/3 rounded-[2.5rem] md:rounded-[3rem] border border-white/25 bg-white/10 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.4)] ring-1 ring-white/10"
                    >
                        <div className="p-6 md:p-8 h-full flex flex-col justify-between backface-hidden">
                        <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                            <div className="size-8 bg-mint-dark rounded-xl flex items-center justify-center text-white font-black text-xs border border-white/10">S</div>
                            <div>
                                <p className="text-xs font-bold leading-none text-white">Academic Finder</p>
                                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Live Database</p>
                            </div>
                            </div>
                            
                            <div className="relative flex items-center max-w-45 w-full">
                                <Search className="absolute left-2.5 size-3.5 text-white/30" />
                                <input 
                                    ref={searchInputRef}
                                    type="text" 
                                    readOnly
                                    placeholder="Search schools..." 
                                    className="w-full bg-black/20 border border-white/10 pl-8 pr-3 py-1.5 rounded-lg text-[10px] text-white focus:outline-hidden placeholder-white/20 font-medium"
                                />
                            </div>
                        </div>
                        <div className="flex-1 py-6 flex flex-col justify-center space-y-4">
                            <div className="bg-white/10 border border-white/10 p-4 md:p-5 rounded-2xl backdrop-blur-md">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1.5">
                                    <CheckCircle className="size-3.5 text-mint-light" /> Partner Network
                                    </p>
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Verified Live</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-3xl md:text-4xl font-black text-white">
                                    <span ref={linkCounterRef}>100</span>%
                                    </p>
                                    <p className="text-xs font-medium text-white/40 ml-1">Direct Campus Connections</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-mint-dark p-4 md:p-5 rounded-2xl shadow-lg shadow-black/20 text-white flex flex-col justify-between border border-white/10 group/card">
                                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">Exam Modules</p>
                                    <div>
                                        <p className="text-xl md:text-2xl font-black text-mint-light tracking-tight">UPCAT</p>
                                        <p className="text-xl md:text-2xl font-black text-mint-light tracking-tight">USTET</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[10px] uppercase tracking-widest text-mint-light font-bold">Active Threads</p>
                                        <MessageSquare className="size-3.5 text-white/30" />
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-2xl md:text-3xl font-black text-white">
                                            <span ref={forumCounterRef}>1250</span>+
                                        </p>
                                        <p className="text-[9px] text-white/40 font-medium leading-tight mt-1">Discussions Posted This Week</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-20 md:w-24 h-1 bg-white/15 mx-auto rounded-full" />
                        </div>
                        <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] bg-linear-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
            <div className="absolute top-1/2 right-0 w-125 md:w-200 h-full opacity-5 pointer-events-none -z-10 rotate-12 translate-x-1/4 -translate-y-1/2">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path fill="#87df90" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.1,-46.3C90.4,-33.5,96,-18.1,95.3,-3.1C94.6,11.9,87.6,26.5,77.5,38.5C67.4,50.5,54.3,59.9,40.6,67.3C26.9,74.7,13.4,80.1,-1.1,82C-15.6,83.9,-31.2,82.3,-44.6,74.5C-58,66.7,-69.2,52.7,-76.7,37.3C-84.2,21.9,-88,5.1,-85.7,-10.8C-83.4,-26.7,-75,-41.7,-63.3,-53.4C-51.6,-65.1,-36.6,-73.5,-21.8,-76.6C-7,-79.7,7.8,-77.5,21.8,-73.7L44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>
        </section>
    );
}