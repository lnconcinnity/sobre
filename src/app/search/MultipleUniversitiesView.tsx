/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import Image from "next/image";
import { 
    MapPin, 
    ArrowUpRight, 
    Compass, 
    Shield, 
    Coins, 
    Sparkles 
} from "lucide-react";
import gsap, { useGSAP } from "../../modules/gsap";

interface MultipleUniversitiesViewProps {
    results: any[];
    narratives: any;
    onSelectUniversity: (item: any) => void;
}

export const MultipleUniversitiesView = ({ 
    results, 
    narratives, 
    onSelectUniversity 
}: MultipleUniversitiesViewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!results || results.length === 0) return;
        const tl = gsap.timeline();
        tl.to(containerRef.current, { opacity: 1, duration: 0.3, ease: "none" });
        tl.fromTo(".docket-card", 
            { y: 25, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.5, 
                ease: "power2.out", 
                stagger: 0.05,
                clearProps: "all" 
            },
        );
    }, { scope: containerRef, dependencies: [results] });

    return (
        <div ref={containerRef} className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-8 opacity-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200/80 pb-10 mb-12">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 text-white rounded-md text-[9px] font-black uppercase tracking-widest">
                        <Compass size={10} className="animate-spin-slow" /> Index Vector Active
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-neutral-950 leading-none">
                        Matched Campuses
                    </h2>
                    <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider">
                        Comparative cluster mapping of institutional profiles matching your parameters.
                    </p>
                </div>
                
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-xl">
                    {results.length} Nodes Located in Global Matrix
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((item: any) => {
                    const narrative = narratives?.[item.slug || item.id];
                    return (
                        <div 
                            key={item.id || item.slug}
                            onClick={() => onSelectUniversity(item)} 
                            className="magnetic docket-card group bg-white border border-neutral-200/80 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-neutral-950 hover:shadow-xl transition-colors duration-500 cursor-pointer transform-gpu"
                        >
                            <div className="relative h-44 w-full bg-neutral-950 overflow-hidden transform-gpu translate-z-0 will-change-transform">
                                {item.heroImage ? (
                                    <Image
                                        src={item.heroImage} 
                                        alt={item.name}
                                        fill
                                        sizes="(max-w-7xl) 33vw"
                                        className="object-cover opacity-50 brightness-90 group-hover:scale-103 transition-transform duration-700 ease-out"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-architectural-grid opacity-10 bg-size-[2rem_2rem]" />
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent z-1" />
                                <div className="absolute top-4 left-4 z-10 flex gap-1.5 items-center px-2.5 py-1 bg-neutral-950/70 border border-white/10 rounded-full text-white text-[9px] font-bold uppercase tracking-widest">
                                    <Shield size={10} className="text-mint-light" /> {item.location?.city || "PH"}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight max-w-[80%] text-balance">
                                        {item.name}
                                    </h3>
                                    <div className="p-2.5 bg-white text-black rounded-xl shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                                        <ArrowUpRight size={14} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1 text-mint-dark text-[9px] font-black uppercase tracking-widest">
                                        <Sparkles size={10} /> Profile Rationale
                                    </div>
                                    <p className="text-neutral-600 text-xs font-medium leading-relaxed line-clamp-3 italic">
                                        &ldquo;{narrative?.why || "Dynamic institutional compatibility indexing calculations complete."}&rdquo;
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 flex items-start gap-3.5">
                                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800">
                                        <Coins size={14} strokeWidth={2} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 block leading-none">
                                            Tuition Baseline
                                        </span>
                                        <p className="text-[11px] font-bold text-neutral-950 uppercase tracking-tight line-clamp-1">
                                            {narrative?.projected_tf || "Standardized Rates Querying..."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-3.5 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                                <span className="flex items-center gap-1.5 text-neutral-500">
                                    <MapPin size={11} className="text-neutral-400" /> {item.location?.campus || "Main"} Campus
                                </span>
                                <span className="group-hover:text-neutral-950 transition-colors text-right font-black">
                                    Analyze Node →
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};