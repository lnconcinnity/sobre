/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { 
    Compass, 
    AlertTriangle, 
    Sparkles, 
    Database, 
    Layers, 
    HelpCircle 
} from "lucide-react";
import gsap, { useGSAP, ScrollSmoother } from "../../modules/gsap";
import { useNavStore } from "@/src/store/useNavStore";
import { useInView } from "@/src/hooks/useInView";
import SearchDropdown from "@/src/components/SearchDropdown";
import { useTransition } from "@/src/hooks/useTransition";
import { SingleUniversityView } from "./SingleUniversityView";
import { MultipleUniversitiesView } from "./MultipleUniversitiesView";
import { ProgramsPaginationView } from "./ProgramsPaginationView";
import { ScholarshipsView } from "./ScholarshipsView";
import ThreadItem from "@/src/components/ThreadItem";

export default function SearchPage() {
    const { startTransition } = useTransition();
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const setHeroVisible = useNavStore((state) => state.setHeroVisible);
    const [resultsContainer, inView] = useInView({ threshold: 0.7 });
    
    const [status, setStatus] = useState("idle"); // "error" | "ignored" | "searching" | "reasoning" | "completed"
    const [intent, setIntent] = useState("multiple_universities"); // "scholarships" | "single_university" | "multiple_universities" | "programs"
    const [results, setResults] = useState<any[]>([]);
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [threads, setThreads] = useState<any[]>([]);
    const [narratives, setNarratives] = useState<any>(null);
    const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
    const [loaderText, setLoaderText] = useState("Accessing localized vector indexes...");
    const [seconds, setSeconds] = useState(0);

    const loaderRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHeroVisible(inView);
    }, [inView, setHeroVisible]);

    useEffect(() => {
        setSelectedUniversity(null);
    }, [query]);

    useEffect(() => {
        if (!query) return;
        const controller = new AbortController();
        const runPipeline = async () => {
            try {
                setStatus("searching");
                const analyticsRes = await fetch("/api/analytics/log", { 
                    method: "POST", 
                    body: JSON.stringify({ query }),
                    signal: controller.signal
                });
                const analyticsData = await analyticsRes.json();
                if (analyticsData.status === "ignored" || analyticsData.status === "rejected") {
                    setStatus("ignored");
                    return; 
                }

                const searchRes = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
                const searchData = await searchRes.json();
                
                let originalResults = searchData.results || [];
                const matchedThreads = searchData.threads || [];
                const detectedIntent = searchData.intent || "multiple_universities";
                const slugCandidates = searchData.slugCandidates || []; 

                setIntent(detectedIntent);
                setResults(originalResults);
                setThreads(matchedThreads);

                const scholarshipRes = await fetch(`/api/search/scholarships?q=${encodeURIComponent(query)}`, { signal: controller.signal });
                const scholarshipData = await scholarshipRes.json();
                setScholarships(scholarshipData.results || []);

                if (originalResults.length > 0 || detectedIntent === "scholarships") {
                    setStatus("reasoning");
                    
                    const leanResults = originalResults.map((item: any) => ({
                        id: item.id,
                        slug: item.slug,
                        name: item.name
                    }));

                    const narrativeRes = await fetch("/api/search/reason", {
                        method: "POST",
                        body: JSON.stringify({ 
                            query, 
                            leanResults,
                            intent: detectedIntent,
                            slugCandidates
                        }),
                        signal: controller.signal
                    });

                    const aiData = await narrativeRes.json();
                    const aiResults = aiData.results || {}; 
                    const strictlyValidSlugs = aiData.strictlyValidSlugs || [];

                    if (detectedIntent !== "scholarships" && strictlyValidSlugs.length > 0) {
                        originalResults = originalResults.filter((item: any) => {
                            const itemKey = item.slug || item.id;
                            return strictlyValidSlugs.includes(itemKey);
                        });
                        
                        setResults(originalResults);
                    }

                    if (originalResults.length === 0 && detectedIntent !== "scholarships") {
                        console.warn("No structural assets survived the alignment filters.");
                        setStatus("ignored");
                        return;
                    }

                    const reconciledNarratives: any = {};
                    originalResults.forEach((item: any) => {
                        const slugKey = item.slug || item.id;
                        if (aiResults[slugKey]) {
                            reconciledNarratives[slugKey] = aiResults[slugKey];
                        } else {
                            reconciledNarratives[slugKey] = {
                                why: "Platform intelligence maps are finalizing specialized structural breakdowns.",
                                projected_tf: "Calculating semi-annual base cost metrics...",
                                footnotes: "Logistical details parsing."
                            };
                        }
                    });

                    setNarratives(reconciledNarratives);
                    setStatus("completed");
                } else {
                    setStatus("ignored");
                }
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                console.error("Pipeline Exception Captured:", err);
                setStatus("error");
            }
        };

        runPipeline();
        return () => controller.abort();
    }, [query]);

    useEffect(() => {
        if (status !== "searching" && status !== "reasoning") return;
        const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, [status]);

    useEffect(() => {
        if (status !== "searching" && status !== "reasoning") return;
        const ambientPrompts = [
            "Deconstructing semantic vector strings...",
            "Sifting through user community discussions...",
            "Calculating historical institutional tuition curves...",
            "Predicting geographic logistical friction indexes...",
            "Compiling unified scholarship grant registers..."
        ];
        let step = 0;
        const interval = setInterval(() => {
            setLoaderText(ambientPrompts[step % ambientPrompts.length]);
            step++;
        }, 2200);
        return () => clearInterval(interval);
    }, [status]);

    useGSAP(() => {
        if (status === "completed" && loaderRef.current) {
            gsap.to(loaderRef.current, {
                opacity: 0,
                y: -30,
                duration: 0.6,
                ease: "power3.inOut",
                onComplete: () => {
                    gsap.set(loaderRef.current, { display: "none" });
                }
            });
        }
    }, [status]);

    useGSAP(() => {
        if ((seconds === 6 || seconds === 12) && hintRef.current) {
            gsap.fromTo(hintRef.current, 
                { y: 15, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
            );
        }
    }, [seconds]);

    const execSearch = (q: string) => {
        if (!q.trim()) return;
        startTransition(`/search?q=${encodeURIComponent(q.trim())}`);
    };

    return (
        <div key={query} className="relative min-h-screen bg-[#fbfdfb] text-neutral-900 selection:bg-mint-dark/20 selection:text-neutral-950">
            <div className="h-screen absolute inset-0 size-full z-0 pointer-events-none invisible" ref={resultsContainer} />
            {status === "error" && (
                <div className="h-screen w-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-4 rounded-full bg-red-50 border border-red-100 text-red-500 mb-6 shadow-xs">
                        <AlertTriangle size={32} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-neutral-950 max-w-md leading-none mb-3">
                        Pipeline Registry Disruption
                    </h2> 
                    <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider max-w-xs leading-relaxed">
                        The matrix database encountered a lookup error. Re-verify your network link or parse query parameters again.
                    </p>
                </div>
            )}
            {status === "ignored" && (
                <div className="h-screen w-full flex flex-col items-center justify-center p-6 text-center bg-radial from-white via-[#fbfdfb] to-neutral-50/50">
                    <div className="p-4 rounded-full bg-neutral-900 text-white mb-6 shadow-xl relative group">
                        <div className="absolute inset-0 rounded-full bg-mint-light opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500" />
                        <Compass size={32} strokeWidth={1.5} className="animate-spin-slow" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-neutral-950 max-w-md leading-none mb-2">
                        Unrecognized Query Vector
                    </h2> 
                    <p className="text-neutral-400 text-xs font-medium uppercase tracking-widest max-w-xs">
                        No schools, programs, or financial grants correspond to this input path.
                    </p>
                    <div className="text-left w-full max-w-xs">
                        <SearchDropdown label="Re-index search parameters..." name="nav-search" onSearch={(q) => execSearch(q)} />
                    </div>
                </div>
            )}

            {(status === "searching" || status === "reasoning") && (
                <div 
                    ref={loaderRef} 
                    className="fixed inset-0 h-screen bg-white z-200 flex flex-col items-center justify-center p-6 text-center select-none"
                >
                    <div className="relative mb-8 flex items-center justify-center">
                        <div className="w-20 h-20 border border-neutral-100 rounded-full absolute" />
                        <div className="w-20 h-20 border-t border-mint-dark rounded-full animate-spin absolute" />
                        <div className="w-12 h-12 border border-dashed border-neutral-200 rounded-full absolute animate-spin-reverse" />
                        {status === "searching" ? (
                            <Database size={18} className="text-neutral-400 animate-pulse" />
                        ) : (
                            <Sparkles size={18} className="text-mint-dark animate-pulse" />
                        )}
                    </div>
                    
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-mint-dark mb-2 flex items-center gap-1.5">
                        <Layers size={12} /> Unified Academic Engine
                    </span>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-neutral-950 mb-1">
                        Synthesizing Context Arrays
                    </h2>
                    <p className="text-neutral-400 text-xs font-medium italic min-h-5 transition-all duration-300">
                        {loaderText}
                    </p>

                    <div ref={hintRef} className="h-6 mt-8 opacity-0">
                        {seconds >= 12 ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-md text-amber-600 font-bold uppercase text-[9px] tracking-widest">
                                <HelpCircle size={10} /> Query requires deep thematic cross-referencing. Stand by.
                            </div>
                        ) : seconds >= 6 ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-md text-neutral-500 font-bold uppercase text-[9px] tracking-widest">
                                <Sparkles size={10} className="text-mint-dark" /> Merging system matrices with live peer thread data...
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {status === "completed" && (
                <>
                {intent === "single_university" && results.length > 0 ? (
                    <SingleUniversityView 
                        item={results[0]} 
                        narrative={narratives?.[results[0].slug || results[0].id]} 
                    />
                ) : selectedUniversity ? (
                    <SingleUniversityView 
                        item={selectedUniversity} 
                        narrative={narratives?.[selectedUniversity.slug || selectedUniversity.id]} 
                        onBack={() => {
                            setSelectedUniversity(null);
                            setTimeout(() => {
                                const smoother = ScrollSmoother.get();
                                if (smoother) smoother.scrollTop(0);
                            }, 50);
                        }}
                    />
                ) : intent === "scholarships" && results.length > 0 ? (
                    <ScholarshipsView 
                        results={results}
                    />
                ) : intent === "programs" && results.length > 0 ? (
                    <ProgramsPaginationView 
                        results={results}
                        narratives={narratives}
                    />
                ) : intent === "multiple_universities" && results.length > 0 ? (
                    <MultipleUniversitiesView 
                        results={results}
                        narratives={narratives}
                        onSelectUniversity={(item) => setSelectedUniversity(item)}
                    />
                ) : (
                    <div className="w-full max-w-7xl mx-auto py-12 px-6">
                        <div className="flex flex-col items-center justify-center text-center mb-12">
                            <span className="px-3 py-1 bg-neutral-900 text-white rounded-md text-[9px] font-black uppercase tracking-widest mb-3">
                                Intent Layer: {intent.replace("_", " ")}
                            </span>
                            <h2 className="text-4xl font-black uppercase tracking-tight text-neutral-950">
                                Platform Search Index Matrix
                            </h2>
                        </div>
                        <div className="p-12 border-2 border-dashed border-neutral-200 rounded-4xl text-center bg-white/50">
                            <p className="text-neutral-400 text-sm font-medium italic">
                                Specialized layout switch logic target node ready for structural generation.
                            </p>
                        </div>
                    </div>
                )}
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-24 select-none">
                    {scholarships.length > 0 && intent !== "scholarships" && (
                        <div className="w-full mt-20 border-t border-neutral-100 pt-16">
                            <div className="flex flex-col items-center text-center mb-12">
                                <span className="px-2.5 py-1 bg-mint-dark/5 border border-mint-dark/10 rounded-md text-[9px] font-black text-mint-dark uppercase tracking-[0.2em] mb-3">
                                    Financial Provisions Matrix
                                </span>
                                <h2 className="text-3xl font-black text-neutral-950 uppercase tracking-tighter sm:text-4xl">
                                    Matching Grants & Financial Aid
                                </h2>
                                <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 font-semibold uppercase tracking-wider max-w-md">
                                    Active auxiliary stipends aligned to this specific vector criteria
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {scholarships.map((s: any) => (
                                    <div 
                                        key={s.id} 
                                        className="group bg-white border border-neutral-100 rounded-2xl p-6 hover:border-neutral-950 hover:shadow-xs transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                                    >
                                        <div>
                                            <div className="flex justify-between items-center gap-4 mb-4 pb-3 border-b border-neutral-50">
                                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest truncate">
                                                    {s.provider}
                                                </span>
                                                {s.tags?.includes("Female-Only") && (
                                                    <span className="text-[8px] font-black text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                                                        Women Only
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-base font-black text-neutral-950 uppercase tracking-tight leading-snug group-hover:text-mint-dark transition-colors duration-200">
                                                {s.name}
                                            </h4>
                                            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mt-2 line-clamp-3">
                                                {s.description}
                                            </p>
                                        </div>
                                        <div className="mt-6">
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {s.tags?.slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="text-[8px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 rounded-xs uppercase tracking-wide">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <a 
                                                href={s.links?.apply} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="magnetic flex items-center justify-center w-full py-2.5 bg-neutral-950 text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-mint-dark transition-colors duration-200"
                                            >
                                                Apply Now
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {threads.length > 0 && (
                        <div className="w-full mt-24 border-t border-neutral-100 pt-16">
                            <div className="flex flex-col items-center text-center mb-12">
                                <span className="px-2.5 py-1 bg-neutral-950 text-white rounded-md text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                                    Collective Archive Intelligence
                                </span>
                                <h2 className="text-3xl font-black text-neutral-950 uppercase tracking-tighter sm:text-4xl">
                                    Peer-to-Peer Discussions
                                </h2>
                                <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 font-semibold uppercase tracking-wider max-w-md">
                                    Live analytical discussions parsed from our active local forum index
                                </p>
                            </div>
                            <div className="max-w-4xl mx-auto space-y-3.5">
                                {threads.map((thread: any) => (
                                    <ThreadItem key={thread.id} thread={thread} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="w-full flex justify-center mt-20 border-t border-neutral-50 pt-8">
                        <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest text-center max-w-xl leading-relaxed">
                            Results generated via semantic hybrid-vector query strings. Parameter alignments depend entirely on localized database indexes. Cross-verify registration deadlines and tuition matrix updates with official institutional registrars.
                        </p>
                    </div>
                </div>
                </>
            )}
        </div>
    );
}