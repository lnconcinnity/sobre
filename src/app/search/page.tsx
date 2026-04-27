/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap, { useGSAP } from "../../modules/gsap";
import { ProgramAccordion } from "@/src/components/ProgramAccordion";
import { UniversityCard } from "@/src/components/UniversityCard";
import { useNavStore } from "@/src/store/useNavStore";
import { useInView } from "@/src/hooks/useInView";
import SearchDropdown from "@/src/components/SearchDropdown";
import { useTransition } from "@/src/hooks/useTransition";

export default function SearchPage() {
    const { startTransition } = useTransition();
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const setHeroVisible = useNavStore((state) => state.setHeroVisible);
    const [resultsContainer, inView] = useInView({ threshold: 0.5, });
    
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [status, setStatus] = useState("idle"); // -1=err, 0=idle, 1=search, 2=reason, 3=done, 4=none
    const [results, setResults] = useState<any[]>([]);
    const [intent, setIntent] = useState("universities");
    const [narratives, setNarratives] = useState<any>(null);
    const [loaderText, setLoaderText] = useState("Consulting the archives...");
    const [concerns, setConcerns] = useState<any[]>([]);
    const [seconds, setSeconds] = useState(0);
    const [threads, setThreads] = useState<any[]>([]);

    const universitiesContainerRef = useRef(null);
    const loaderRef = useRef(null);
    const hintRef = useRef(null);

    useEffect(() => {
        setHeroVisible(inView);
    }, [inView, setHeroVisible]);

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
                const originalResults = searchData.results || [];
                const threads = searchData.threads || [];
                const intent = searchData.intent;

                setIntent(intent);
                setResults(originalResults);
                setThreads(threads);

                const scholarshipRes = await fetch(`/api/search/scholarships?q=${encodeURIComponent(query)}`, { signal: controller.signal });
                const scholarshipData = await scholarshipRes.json();
                setScholarships(scholarshipData.results || []);

                if (originalResults.length > 0) {
                    setStatus("reasoning");
                    const narrativeRes = await fetch("/api/search/reason", {
                        method: "POST",
                        body: JSON.stringify({ query, searchResults: originalResults, intent }),
                        signal: controller.signal
                    });

                    const aiData = await narrativeRes.json();
                    const aiResults = aiData.results || {}; 
                    const concernArray = aiData.concerns || [];

                    const reconciledNarratives: any = {};

                    originalResults.forEach((item: any) => {
                        const originalSlug = item.slug;
                        if (aiResults[originalSlug]) {
                            reconciledNarratives[originalSlug] = aiResults[originalSlug];
                        } else {
                            const fuzzyKey = Object.keys(aiResults).find(k => k.toLowerCase() === originalSlug.toLowerCase());
                            reconciledNarratives[originalSlug] = fuzzyKey ? aiResults[fuzzyKey] : {
                                why: "Expert analysis specifically for this curriculum is being finalized.",
                                projected_tf: "Fetching rates...",
                                footnotes: "Logistics data currently updating."
                            };
                        }
                    });

                    setConcerns(concernArray);
                    setNarratives(reconciledNarratives);
                    setStatus("completed");
                } else setStatus("ignored");
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                console.error(err);
                setStatus("error");
            }
        };
        runPipeline();
        return () => controller.abort();
    }, [query]);
    useEffect(() => {
        if (status === "searching" || status === "reasoning") return;
        const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, [status]);
    useGSAP(() => {
        if (status === "completed") {
            gsap.to(loaderRef.current, {
                opacity: 0,
                y: -50,
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => {
                    gsap.set(loaderRef.current, { display: "none" });
                }
            });
        }
    }, [status]);
    useEffect(() => {
        if (status === "searching" || status === "reasoning") return;
        const messages = [
            "Checking admission rates...",
            "Analyzing campus culture...",
            "Predicting SLEX traffic peaks...",
            "Sifting through the vibes..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            setLoaderText(messages[i % messages.length]);
            i++;
        }, 2500);
        return () => clearInterval(interval);
    }, [status]);

    useGSAP(() => {
        if (seconds === 6 || seconds === 12) {
            gsap.fromTo(hintRef.current, 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    }, [seconds]);

    const execSearch = (q: string) => {
        if (!q.trim()) return;
        startTransition(`/search?q=${encodeURIComponent(q.trim())}`);
    }

    return (
        <div key={query} className="relative min-h-screen bg-neutral-50" ref={resultsContainer}>
            {status === "error" && (
                <div className="h-screen flex flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
                        Oops, something went wrong!
                    </h2> 
                    <p className="text-neutral-400 text-sm font-medium italic">
                        Please try again later or rephrase your query.
                    </p>
                </div>
            )}
            {status === "ignored" && (
                <div className="h-screen flex flex-col items-center justify-center gap-4 **:transition-none">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
                        We couldn&apos;t make sense of that!
                    </h2> 
                    <p className="text-neutral-400 text-sm font-medium italic">
                        Try searching for a specific degree, program, or university.
                    </p>
                    <SearchDropdown label="Search..." name="nav-search" onSearch={(q) => execSearch(q)} />
                </div>
            )}
            {status === "searching" || status === "reasoning" ? (
                <div 
                    ref={loaderRef} 
                    className="fixed h-screen inset-0 bg-white z-200 flex flex-col items-center justify-center p-6 text-center"
                >
                    <div className="relative mb-8">
                        <div className="w-16 h-16 border-2 border-neutral-100 border-t-mint-dark rounded-full animate-spin" />
                    </div>
                    
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
                        Finding your path...
                    </h2>
                    <p className="text-neutral-400 text-sm font-medium animate-pulse italic min-h-5">
                        {loaderText}
                    </p>

                    <div ref={hintRef} className="h-6 mt-4 opacity-0">
                        {seconds >= 12 ? (
                            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Hang on, some transference... we&apos;re deep in thought!</span>
                        ) : seconds >= 6 ? (
                            <span className="text-[10px] text-mint-dark font-bold uppercase tracking-widest">Almost there, some glitters and sprinkles...</span>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <section className={`py-12 px-6 transition-opacity duraiton-1000 ease-out ${status === "completed" ? "opacity-100" : "opacity-0"}`}>
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <h2 className="text-5xl font-black text-center text-black uppercase tracking-wide mb-12">
                        Here&apos;s what we got
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full" ref={universitiesContainerRef}>
                        {(results || []).map((item: any) => (
                            intent === "programs" ? (
                                <ProgramAccordion key={item.id} item={item} narratives={narratives} />
                            ) : (
                                <UniversityCard key={item.slug} item={item} narrative={narratives?.[item.slug]} />
                            )
                        ))}
                    </div>
                    {concerns.length > 0 && (
                        <div className="mt-4 flex flex-col items-center gap-2">
                            {concerns.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">Note:</span>
                                    <p className="text-[11px] font-medium text-amber-800 italic">{typeof item === 'object' ? item.note : item}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {scholarships.length > 0 && (
                        <div className="w-full mt-12 border-t border-neutral-200 pt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="flex flex-col items-center mb-12">
                                <span className="px-3 py-1 bg-mint-light/10 border border-mint-dark/20 rounded-full text-[10px] font-black text-mint-dark uppercase tracking-[0.2em] mb-4">
                                    Financial Support
                                </span>
                                <h2 className="text-4xl font-black text-center text-black uppercase tracking-tight">
                                    We Got You Covered
                                </h2>
                                <p className="text-neutral-400 text-sm mt-2 font-medium">
                                    Grants and external scholarships matching your query
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                {scholarships.map((s: any) => (
                                    <div key={s.id} className="group p-6 bg-white border border-neutral-100 rounded-3xl hover:border-neutral-900 transition-all duration-500 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{s.provider}</span>
                                                {s.tags?.includes("Female-Only") && (
                                                    <span className="text-[8px] font-black text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full uppercase">Women Only</span>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-black leading-tight mb-2 uppercase">{s.name}</h4>
                                            <p className="text-[11px] text-neutral-500 font-medium line-clamp-3">{s.description}</p>
                                        </div>
                                        
                                        <div className="mt-6 flex flex-wrap gap-1">
                                            {s.tags?.slice(0, 3).map((tag: string) => (
                                                <span key={tag} className="text-[8px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-lg uppercase">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <a 
                                            href={s.links?.apply} 
                                            target="_blank" 
                                            className="magnetic mt-4 w-full py-3 bg-neutral-900 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-mint-dark transition-colors"
                                        >
                                            Apply Now
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {threads.length > 0 && (
                        <div className="w-full mt-24 border-t border-neutral-200 pt-16">
                            <div className="flex flex-col items-center mb-12">
                                <span className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                    Community Intelligence
                                </span>
                                <h2 className="text-4xl font-black text-center text-black uppercase tracking-tight">
                                    Peer Discussions
                                </h2>
                                <p className="text-neutral-400 text-sm mt-2 font-medium">
                                    Relevant threads from the collective archive
                                </p>
                            </div>

                            <div className="max-w-4xl mx-auto space-y-4">
                                {threads.map((thread) => (
                                    <div 
                                        key={thread.id}
                                        onClick={() => startTransition(`/forum/${thread.id}`)}
                                        className="magnetic group p-6 bg-white border border-neutral-100 rounded-3xl hover:border-black transition-colors cursor-pointer flex justify-between items-center"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                {thread.tags?.slice(0, 2).map((tag: string) => (
                                                    <span key={tag} className="text-[8px] font-black text-mint-dark uppercase tracking-widest">#{tag}</span>
                                                ))}
                                            </div>
                                            <h4 className="text-lg font-bold group-hover:text-mint-dark transition-colors uppercase leading-tight">
                                                {thread.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-[9px] font-black text-neutral-400 uppercase tracking-tighter">
                                                <span>{thread.authorName}</span>
                                                <span className="size-1 bg-neutral-200 rounded-full" />
                                                <span>{thread.replies || 0} Discussions</span>
                                            </div>
                                        </div>
                                        <div className="text-right pl-6 border-l border-neutral-50">
                                            <span className="text-xl font-black text-neutral-200 group-hover:text-black transition-colors">
                                                {thread.karma ? `${Math.sign(thread.karma) === -1 ? "-" : "+"} ${Math.abs(thread.karma)}` : 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <p className="mt-8 text-[9px] text-neutral-400 uppercase font-bold tracking-widest text-center max-w-lg">
                        Results are generated via hybrid-vector search. Accuracy depends on provided query and quality vector data on our end. Cross-verify with official school registrars.
                    </p>
                </div>
            </section>
        </div>
    );
}