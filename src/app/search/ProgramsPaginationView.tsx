/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Clock, ChevronRight, ChevronLeft, Award } from "lucide-react";
import gsap from "gsap";
import { UniversityCarousel } from "./UniversityCarousel";

interface ProgramsPaginationViewProps {
    results: any[];
    narratives: any;
}

export function ProgramsPaginationView({ results, narratives }: ProgramsPaginationViewProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const progressTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const progressBarRefs = useRef<HTMLDivElement[]>([]);

    const AUTOPLAY_DURATION = 8;
    const currentProgram = results[activeIndex];
    const currentNarrative = narratives?.[currentProgram?.slug || currentProgram?.id] || {};

    const setProgressBarRef = (el: HTMLDivElement | null, index: number) => {
        if (el) progressBarRefs.current[index] = el;
    };

    useEffect(() => {
        if (results.length <= 1) return;

        if (progressTimelineRef.current) {
            progressTimelineRef.current.kill();
        }

        const activeBar = progressBarRefs.current[activeIndex];
        if (!activeBar) return;

        progressBarRefs.current.forEach((bar, idx) => {
            if (idx !== activeIndex) gsap.set(bar, { scaleX: 0 });
        });

        const tl = gsap.timeline({
            onComplete: () => {
                setActiveIndex((prev) => (prev + 1) % results.length);
            }
        });

        progressTimelineRef.current = tl;

        tl.fromTo(activeBar, 
            { scaleX: 0 }, 
            { 
                scaleX: 1, 
                duration: AUTOPLAY_DURATION, 
                ease: "none",
                transformOrigin: "left center"
            }
        );

        if (isHovered) {
            tl.pause();
        } else {
            tl.play();
        }

        return () => {
            if (tl) tl.kill();
        };
    }, [activeIndex, results.length, isHovered]);

    useEffect(() => {
        if (!containerRef.current) return;
        gsap.fromTo(".program-fade-target",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stuffed: true, stagger: 0.06 }
        );
    }, [activeIndex]);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % results.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    };

    if (!currentProgram) return null;
    return (
        <div 
            ref={containerRef}
            className="w-full max-w-7xl mx-auto py-12 px-4 md:px-6 min-h-[80vh] flex flex-col justify-between select-none"
        >
            <div className="w-full flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-mint-dark text-white shadow-sm">
                        <BookOpen size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-mint-dark">Curriculum matrix view</span>
                        <h1 className="text-xl font-black uppercase tracking-tight text-neutral-950">Specialized Academic Profiles</h1>
                    </div>
                </div>
                { results.length > 1 && (
                    <div className="flex items-center gap-2.5">
                        <button 
                            onClick={handlePrev}
                            className="magnetic p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                        >
                            <ChevronLeft size={16} strokeWidth={2.5} />
                        </button>
                        <div className="flex items-center gap-1.5 px-2">
                            {results.map((prog, idx) => (
                                <button
                                    key={prog.slug || idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className="magnetic group flex flex-col gap-1 items-start py-2 cursor-pointer focus:outline-hidden"
                                >
                                    <div className="w-10 h-1 border border-neutral-100 bg-neutral-200/60 rounded-full relative overflow-hidden">
                                        <div 
                                            ref={(el) => setProgressBarRef(el, idx)}
                                            className="absolute inset-y-0 left-0 bg-mint-dark w-full scale-x-0 rounded-full"
                                        />
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${idx === activeIndex ? 'text-mint-dark' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                                        0{idx + 1}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={handleNext}
                            className="magnetic p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                        >
                            <ChevronRight size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>
            <div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="lg:col-span-5 flex flex-col gap-5 justify-center">
                    <div className="program-fade-target flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-neutral-950 text-white font-black text-[9px] tracking-widest uppercase">
                            {currentProgram.id?.startsWith("bs-") ? "Undergraduate Major" : "Degree Path"}
                        </span>
                        {results.length > 1 && isHovered && (
                            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-600 animate-pulse bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-sm">
                                <Clock size={10} /> Auto-advance suspended
                            </span>
                        )}
                    </div>
                    <h2 className="program-fade-target text-4xl lg:text-5xl font-black uppercase tracking-tighter text-neutral-950 leading-none max-w-xl">
                        {currentProgram.name || currentProgram.title || "Academic Program"}
                    </h2>
                    <div className="program-fade-target flex items-baseline gap-2 mt-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Projected Cost:</span>
                        <span className="text-2xl font-black text-mint-dark tracking-tight">
                            {currentNarrative.projected_tf || "Calculating metrics..."}
                        </span>
                    </div>
                    {currentNarrative.footnotes && (
                        <div className="program-fade-target mt-4 p-4 border border-dashed border-neutral-200 bg-neutral-50/50 rounded-2xl flex gap-3 items-start">
                            <div className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-500 mt-0.5">
                                <Award size={14} />
                            </div>
                            <div>
                                <span className="block text-[9px] font-black uppercase tracking-wider text-neutral-400 mb-0.5">Academic Rigor Breakdown</span>
                                <p className="text-neutral-500 text-xs italic font-medium">
                                    &quot;{currentNarrative.footnotes}&quot;
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="lg:col-span-7 w-full program-fade-target bg-neutral-50/40 border border-neutral-200/60 p-4 rounded-3xl">
                    <UniversityCarousel 
                        providers={currentProgram.schools || []} 
                        narrativeAnalysis={currentNarrative.why}
                    />
                </div>
            </div>
        </div>
    );
}