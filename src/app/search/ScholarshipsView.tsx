"use client";

import { useEffect, useRef } from "react";
import { Award, Building2, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import gsap from "gsap";

interface ScholarshipProvider {
    id: string;
    name: string;
    provider: string;
    description: string;
    tags?: string[];
    links?: {
        apply?: string;
    };
}

interface ScholarshipsViewProps {
    results: ScholarshipProvider[];
}

export function ScholarshipsView({ results }: ScholarshipsViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!containerRef.current) return;
        gsap.fromTo(".scholarship-fade-target",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.05 }
        );
    }, [results]);

    if (!results || results.length === 0) return null;
    return (
        <div 
            ref={containerRef}
            className="w-full max-w-7xl mx-auto py-12 px-4 md:px-6 min-h-[70vh] flex flex-col justify-between select-none"
        >
            <div className="w-full flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6 mb-12">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-neutral-950 text-white shadow-sm">
                        <Award size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-mint-dark">Primary Intent Layer</span>
                        <h1 className="text-xl font-black uppercase tracking-tight text-neutral-950">Verified Endowment Registry</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200/60 bg-neutral-50/50">
                    <span className="w-2 h-2 bg-mint-dark rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                        {results.length} Active Allocations Loaded
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto w-full">
                <div className="lg:col-span-4 flex flex-col gap-5 justify-center">
                    <span className="scholarship-fade-target w-max px-2.5 py-1 rounded-md bg-mint-dark text-white font-black text-[9px] tracking-widest uppercase">
                        Direct Financial Route
                    </span>
                    <h2 className="scholarship-fade-target text-4xl lg:text-5xl font-black uppercase tracking-tighter text-neutral-950 leading-none max-w-sm">
                        Subsidy Indexing Complete
                    </h2>
                    <p className="scholarship-fade-target text-neutral-500 text-xs font-semibold leading-relaxed uppercase tracking-wider mt-2">
                        These institutional programs and private corporate grants match your specific parameter vectors. Review compliance criteria before establishing direct external application claims.
                    </p>
                    <div className="scholarship-fade-target mt-4 p-4 border border-dashed border-neutral-200 bg-neutral-50/40 rounded-2xl space-y-3">
                        <div className="flex gap-2.5 items-start">
                            <CheckCircle2 size={14} className="text-mint-dark mt-0.5 shrink-0" />
                            <p className="text-neutral-500 text-[11px] font-medium leading-tight">
                                Automated vetting cross-referenced against active provider cycles.
                            </p>
                        </div>
                        <div className="flex gap-2.5 items-start">
                            <ShieldCheck size={14} className="text-neutral-500 mt-0.5 shrink-0" />
                            <p className="text-neutral-500 text-[11px] font-medium leading-tight">
                                Secular, localized, and corporate funds loaded dynamically.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    {results.map((s) => (
                        <div 
                            key={s.id} 
                            className="scholarship-fade-target group bg-white border border-neutral-100 rounded-2xl p-6 hover:border-neutral-950 transition-colors duration-300 flex flex-col justify-between min-h-80"
                        >
                            <div>
                                <div className="flex justify-between items-center gap-4 mb-4 pb-3 border-b border-neutral-50">
                                    <div className="flex items-center gap-1.5 text-neutral-400 max-w-[70%]">
                                        <Building2 size={12} className="shrink-0" />
                                        <span className="text-[9px] font-black uppercase tracking-widest truncate">
                                            {s.provider}
                                        </span>
                                    </div>
                                    {s.tags?.includes("Female-Only") && (
                                        <span className="text-[8px] font-black text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                                            Women Only
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-base font-black text-neutral-950 uppercase tracking-tight leading-snug group-hover:text-mint-dark transition-colors duration-200">
                                    {s.name}
                                </h4>
                                <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mt-2 line-clamp-4">
                                    {s.description}
                                </p>
                            </div>
                            <div className="mt-6">
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {s.tags?.slice(0, 2).map((tag: string) => (
                                        <span key={tag} className="text-[8px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 rounded-xs uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                {s.links?.apply && (
                                    <a 
                                        href={s.links.apply} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="magnetic flex items-center justify-center gap-1.5 w-full py-2.5 bg-neutral-950 text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-mint-dark transition-colors duration-200"
                                    >
                                        Initiate Manifest <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}