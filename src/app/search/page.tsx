/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap, { useGSAP } from "../../modules/gsap";
import { ProgramAccordion } from "@/src/components/ProgramAccordion";
import { UniversityCard } from "@/src/components/UniversityCard";
import { useNavStore } from "@/src/store/useNavStore";
import { useInView } from "@/src/hooks/useInView";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const setHeroVisible = useNavStore((state) => state.setHeroVisible);
    const [resultsContainer, inView] = useInView({ threshold: 0.7, });
    
    const [status, setStatus] = useState(0); // -1=err, 0=idle, 1=search, 2=reason, 3=done, 4=none
    const [results, setResults] = useState<any[]>([]);
    const [intent, setIntent] = useState("universities");
    const [narratives, setNarratives] = useState<any>(null);
    const [loaderText, setLoaderText] = useState("Consulting the archives...");
    const [concerns, setConcerns] = useState<any[]>([]);
    const [seconds, setSeconds] = useState(0);

    const universitiesContainerRef = useRef(null);
    const loaderRef = useRef(null);
    const hintRef = useRef(null);

    useEffect(() => {
        setHeroVisible(inView);
    }, [inView, setHeroVisible]);

   useEffect(() => {
        if (!query) return;
        const runPipeline = async () => {
            try {
                setStatus(1);
                fetch("/api/analytics/log", { method: "POST", body: JSON.stringify({ query }) });

                const searchRes = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const searchData = await searchRes.json();
                const originalResults = searchData.results || [];
                const intent = searchData.intent;

                setIntent(intent);
                setResults(originalResults);

                if (originalResults.length > 0) {
                    setStatus(2);
                    const narrativeRes = await fetch("/api/search/reason", {
                        method: "POST",
                        body: JSON.stringify({ query, searchResults: originalResults, intent }),
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
                    setStatus(3);
                } else setStatus(4);
            } catch (err) {
                console.error(err);
                setStatus(-1);
            }
        };
        runPipeline();
    }, [query]);
    useEffect(() => {
        if (status <= 0 || status >= 3) return;
        const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, [status]);
    useGSAP(() => {
        if (status === 3) {
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
        if (status <= 0 || status >= 3) return;
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
    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(".glass-panel", {
            backdropFilter: "blur(0px)",
            backgroundColor: "rgba(255, 255, 255, 0)",
            border: "1px solid rgba(255, 255, 255, 0)",
            duration: 1.5,
            ease: "power2.inOut"
        }, "-=0.8");
    }, { scope: universitiesContainerRef });

    return (
        <div className="relative min-h-screen bg-neutral-50" ref={resultsContainer}>
            {status === -1 && (
                <div className="h-screen flex flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
                        Oops, something went wrong!
                    </h2> 
                    <p className="text-neutral-400 text-sm font-medium italic">
                        Please try again later or rephrase your query.
                    </p>
                </div>
            )}
            {(status < 3 && status !== -1 && status !== 4) || status === 3 ? (
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

            <section className={`py-12 px-6 transition-opacity duration-1000 ${status === 3 ? 'opacity-100' : 'opacity-0'}`}>
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
                    <p className="mt-8 text-[9px] text-neutral-400 uppercase font-bold tracking-widest text-center max-w-lg">
                        Results are generated via hybrid-vector search. Cross-verify with official school registrars.
                    </p>
                </div>
            </section>
        </div>
    );
}