"use client";

import gsap, { useGSAP } from "../modules/gsap";
import InkStroke from "../components/InkStroke";
import { useEffect, useState } from "react";
import FemaleBloggerPNG from "../assets/female-blogger.png"
import Image from "next/image";
import { useInView } from "../hooks/useInView";
import { useNavStore } from "../store/useNavStore";
import SearchDropdown from "../components/SearchDropdown";
import MetricsSection from "../components/sections/MetricsSection";
import ProceduresSection from "../components/sections/ProceduresSection";
import ProcessHeader from "../components/sections/ProcessHeader";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import { useTransition } from "../hooks/useTransition";

export default function HomePage() {
    const setHeroVisible = useNavStore((state) => state.setHeroVisible);
    const [welcomeContainer, inView] = useInView({ threshold: 0.4, });
    const { startTransition } = useTransition();
    const [trendingSearches, setTrendingSearches] = useState([
        { id: "seed1", label: "UPCAT Prep 2026", query: "upcat" },
        { id: "seed2", label: "Best Engineering Schools", query: "engineering" },
        { id: "seed3", label: "Scholarships", query: "scholarships" },
    ]);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const res = await fetch("/api/analytics/trends");
                const data = await res.json();
                if (Array.isArray(data)) setTrendingSearches(data);
            } catch (err) {
                console.error("Trend fetch failed:", err);
            }
        };
        fetchTrends();
    }, []);

    useEffect(() => {
        setHeroVisible(inView);
    }, [inView, setHeroVisible]);

    useGSAP(() => {
        if (!welcomeContainer.current) return;
        const paths = gsap.utils.toArray(".brush-path");
        const colors = ["#87df90", "#6fcb7a", "#58b765", "#41a350"];
        gsap.set(paths, { 
            drawSVG: "0%",
            stroke: (i) => colors[i % colors.length],
        })
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
        })
    }, { scope: welcomeContainer });

    const execSearch = (q: string) => {
        if (!q.trim()) return;
        startTransition(`/search?q=${encodeURIComponent(q.trim())}`);
    };

    return (<>
        <div ref={welcomeContainer} className="relative min-h-dvh overflow-hidden">
            <div className="absolute inset-0">
                <div className="bottom-left-stroke absolute bottom-0 left-0 w-xs sm:w-md md:w-xl h-auto rotate-180">
                    <InkStroke className="w-full h-full" />
                </div>
            </div>
            <section className="relative min-h-dvh z-10 flex flex-col md:flex-row items-center justify-center">
                <div className="absolute inset-0 flex items-end justify-center md:justify-start" data-speed="0.8">
                    <Image 
                        src={FemaleBloggerPNG} 
                        alt="Mascot" 
                        className="w-sm sm:w-2xl md:w-5xl h-auto"
                        priority 
                    />
                </div>
                <div className="relative z-20 w-full md:w-1/2 ml-auto px-8 md:px-16 py-12">
                    <div className="max-w-xl">
                        <span className="text-mint-dark font-light uppercase tracking-tighter mb-4">Sobre Consultancy Group</span>
                        <h1 className="text-5xl md:text-5xl font-black uppercase">Map your future</h1>
                        <p className="text-lg opacity-80 mb-6">
                            Guiding students through every envelope of opportunity.
                        </p>
                        <div>
                            <SearchDropdown suggestions={trendingSearches} onSearch={execSearch} />
                            <span className="block text-md font-semibold mt-4">Trending Searches</span>
                            <div className="flex gap-4 text-sm">
                                {trendingSearches.map((item) => (
                                    <button 
                                        key={item.id}
                                        type="button" 
                                        onClick={() => execSearch(item.query)}
                                        className="magnetic hover:cursor-pointer hover:text-mint-dark text-neutral-500 transition-colors underline underline-offset-4 decoration-black/10 hover:decoration-mint-dark"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div className="min-h-dvh bg-white">
            <MetricsSection />
            <TestimonialsSection />
            <hr className="my-8 max-w-xl mx-auto border-t border-gray-300" />
            <ProcessHeader />
            <ProceduresSection />
        </div>
    </>)
}