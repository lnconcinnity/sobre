"use client";

import gsap, { useGSAP } from "../modules/gsap";
import InkStroke from "../components/InkStroke";
import { useEffect } from "react";
import useSmoother from "../hooks/useSmoother";
import FemaleBloggerPNG from "../assets/sprites/female-blogger.png"
import Image from "next/image";
import { useInView } from "../hooks/useInView";
import { useNavStore } from "../store/useNavStore";
import SearchDropdown from "../components/SearchDropdown";
import MetricsSection from "../components/sections/MetricsSection";
import ProceduresSection from "../components/sections/ProceduresSection";
import ProcessHeader from "../components/sections/ProcessHeader";
import TestimonialsSection from "../components/sections/TestimonialsSection";

export default function Home() {
    const smoother = useSmoother();
    const setHeroVisible = useNavStore((state) => state.setHeroVisible);
    const [welcomeContainer, inView] = useInView({ threshold: 0.4, });

    const trendingSearches = [ // fetch("/api/analytics/trends") in the future
        { id: 1, label: "Best Engineering Schools", query: "engineering" },
        { id: 2, label: "Full-ride Scholarships", query: "scholarships" },
        { id: 3, label: "Quick Apply", query: "apply" },
    ];
    
    useEffect(() => {
        setHeroVisible(inView);
    }, [inView, setHeroVisible]);

    useGSAP(() => {
        if (!smoother || !welcomeContainer.current) return;
        const paths = gsap.utils.toArray(".brush-path");
        const colors = ["#87df90", "#6fcb7a", "#58b765", "#41a350"];
        gsap.set(paths, { 
            drawSVG: "0%",
            stroke: (i) => colors[i % colors.length],
        })
        smoother.paused(true);
        const tl = gsap.timeline({
            onComplete: () => {
                smoother?.paused(false);
                gsap.to(".top-right-stroke .brush-path", {
                    drawSVG: "0% 0%", 
                    ease: "none",
                    scrollTrigger: {
                        trigger: welcomeContainer.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    }
                });
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
    }, { scope: welcomeContainer, dependencies: [smoother] });

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
                        <form onSubmit={(e) => { e.preventDefault(); /* Handle search logic */ }}>
                            <SearchDropdown />
                            <span className="block text-md font-semibold mt-4">Trending Searches</span>
                            <div className="flex gap-4 text-sm">
                                {trendingSearches.map((item) => (
                                    <button 
                                        key={item.id}
                                        type="button" 
                                        onClick={(e) => e.preventDefault()}
                                        className="magnetic hover:cursor-pointer hover:text-mint-dark text-neutral-500 transition-colors underline underline-offset-4 decoration-black/10 hover:decoration-mint-dark"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </form>
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