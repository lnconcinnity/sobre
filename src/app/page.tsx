"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap, { useGSAP } from "../modules/gsap";
import { useInView } from "../hooks/useInView";
import { useNavStore } from "../store/useNavStore";
import { useTransition } from "../hooks/useTransition";

import InkStroke from "../components/InkStroke";
import SearchDropdown from "../components/SearchDropdown";
import MetricsSection from "../components/sections/MetricsSection";
import ProceduresSection from "../components/sections/ProceduresSection";
import ProcessHeader from "../components/sections/ProcessHeader";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import FemaleBloggerPNG from "../assets/female-blogger.png";

interface TrendingSearchItem {
    id: string | number;
    query: string;
    label: string;
}

export default function HomePage() {
    const setHeroVisible = useNavStore((state) => state.setHeroVisible);
    const [welcomeContainer, inView] = useInView({ threshold: 0.4 });
    const { startTransition } = useTransition();
    const [trendingSearches, setTrendingSearches] = useState<TrendingSearchItem[]>([]);
    const mascotWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchTrends = async () => {
            try {
                const res = await fetch("/api/analytics/trends");
                if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
                
                const data = await res.json();
                if (Array.isArray(data) && isMounted) {
                    setTrendingSearches(data);
                }
            } catch (err) {
                console.error("Sobre API trend fetch failed, falling back to static mocks:", err);
                if (isMounted) {
                    setTrendingSearches([
                        { id: 1, query: "UPCAT Coverage 2026", label: "UPCAT" },
                        { id: 2, query: "USTET Exam Schedule", label: "USTET" },
                        { id: 3, query: "DLSU College Slots", label: "DLSU" }
                    ]);
                }
            }
        };
        fetchTrends();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        setHeroVisible(inView);
        return () => {
            setHeroVisible(true);
        };
    }, [inView, setHeroVisible]);

    useGSAP(() => {
        if (!welcomeContainer.current) return;
        const paths = gsap.utils.toArray<SVGPathElement>(".brush-path");
        const colors = ["#87df90", "#6fcb7a", "#58b765", "#41a350"];
        gsap.set(paths, { 
            drawSVG: "0%",
            stroke: (i) => colors[i % colors.length],
        });

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(".bottom-left-stroke .brush-path", {
                drawSVG: "100% 100%", 
                ease: "none",
                scrollTrigger: {
                    trigger: welcomeContainer.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
                });
            },
        });

        tl.to(paths, {
            drawSVG: "100%",
            duration: 2,
            stagger: 0.1,
            ease: "power2.inOut",
        });
        if (mascotWrapperRef.current) {
            gsap.to(mascotWrapperRef.current, {
                yPercent: 18,
                ease: "none",
                scrollTrigger: {
                trigger: welcomeContainer.current,
                start: "top top",
                end: "bottom top",
                scrub: true
                }
            });
        }
    }, { scope: welcomeContainer });

    const execSearch = (q: string) => {
        if (!q || !q.trim()) return;
        startTransition(`/search?q=${encodeURIComponent(q.trim())}`);
    };

    return (
        <>
        <div ref={welcomeContainer} className="relative min-h-screen overflow-hidden bg-[#f9fdf9]">
            <div className="absolute inset-0 pointer-events-none select-none z-0">
                <div className="bottom-left-stroke absolute bottom-0 left-0 w-xs sm:w-md md:w-xl h-auto rotate-180">
                    <InkStroke className="w-full h-full" />
                </div>
            </div>
            <section className="relative min-h-screen z-10 flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-6 sm:px-8">
                <div 
                    ref={mascotWrapperRef}
                    className="absolute inset-0 flex items-end justify-center md:justify-start pointer-events-none select-none z-10"
                >
                    <Image 
                        src={FemaleBloggerPNG} 
                        alt="Sobre Platform Mascot Graphic" 
                        className="w-sm sm:w-2xl md:w-184 lg:w-216 h-auto object-contain opacity-90 md:opacity-100"
                        priority 
                    />
                </div>
                <div className="relative z-20 w-full md:w-1/2 ml-auto py-12 md:py-24 flex flex-col justify-center">
                    <div className="max-w-xl bg-white/40 md:bg-transparent p-6 sm:p-8 md:p-0 rounded-3xl backdrop-blur-xl md:backdrop-blur-none border border-black/5 md:border-none shadow-xl shadow-black/2 md:shadow-none">
                        <span className="block text-mint-dark font-black tracking-widest uppercase text-xs mb-3">
                            Sobre Consultancy Group
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tighter mb-4 text-neutral-900">
                            Map your <br className="hidden sm:inline" />
                            <span className="italic text-transparent" style={{ WebkitTextStroke: "1.5px #171717" }}>future.</span>
                        </h1>
                        <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed mb-8 max-w-md">
                            Guiding students through every envelope of opportunity with verified local data matrices and custom forum infrastructure.
                        </p>
                        <div className="w-full">
                            <SearchDropdown suggestions={trendingSearches} onSearch={execSearch} />
                            {trendingSearches.length > 0 && (
                                <div className="mt-5 animate-fade-in">
                                    <span className="block text-xs font-black uppercase tracking-wider text-neutral-400 mb-2">
                                    Trending Analytics Searches
                                    </span>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
                                    {trendingSearches.map((item) => (
                                        <button 
                                        key={item.id}
                                        type="button" 
                                        onClick={() => execSearch(item.query)}
                                        className="magnetic hover:cursor-pointer hover:text-mint-dark text-neutral-500 font-bold transition-colors underline underline-offset-4 decoration-black/10 hover:decoration-mint-dark"
                                        >
                                        {item.label}
                                        </button>
                                    ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div className="relative z-30 bg-white">
            <MetricsSection />
            <TestimonialsSection />
            <ProcessHeader />
            <ProceduresSection />
        </div>
        </>
    );
}