/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import Image from "next/image";
import { 
    Globe, 
    MapPin, 
    Coins, 
    Car, 
    ArrowDown, 
    ArrowLeft,
    ExternalLink, 
    GraduationCap, 
    Sparkles,
    ShieldCheck,
    Heart
} from "lucide-react";
import gsap, { useGSAP, ScrollSmoother } from "../../modules/gsap";
import { useAuth } from "@/src/hooks/useAuth";
import { useFavorite } from "@/src/hooks/useFavorite";

interface SingleUniversityViewProps {
    item: any;
    narrative: any;
    onBack?: () => void;
}

export const SingleUniversityView = ({ 
    item, 
    narrative, 
    onBack 
}: SingleUniversityViewProps) => {
    const { user } = useAuth();
    const { toggleFavorite } = useFavorite();
    const isSaved = user?.savedUniversities?.includes(item.name);
    const mainRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        if (!mainRef.current) return;
        const smoother = ScrollSmoother.get();
        if (smoother) smoother.scrollTop(0);

        const tl = gsap.timeline();
        tl.to(mainRef.current, { opacity: 1, duration: 0.2, ease: "none" });
        if (item.heroImage) {
            tl.fromTo(".hero-bg-image",
                { opacity: 0, scale: 1.1 },
                { opacity: 0.35, scale: 1.0, duration: 1.4, ease: "power3.out" },
                "0"
            );
        }
        tl.fromTo(".animate-hero-text", 
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08 },
            "-=1.0"
        );
        tl.fromTo(".animate-fade-in",
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power1.out" },
            "-=0.4"
        );

    }, { scope: mainRef, dependencies: [item] });

    const scrollToSection = (id: string) => {
        const smoother = ScrollSmoother.get();
        if (smoother) {
            smoother.scrollTo(`#${id}`, true, "top top");
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <div ref={mainRef} className="w-full bg-[#fbfdfb] text-neutral-900 selection:bg-mint-dark/20 selection:text-neutral-950 opacity-0">
            <section className="relative min-h-screen lg:h-screen w-full bg-neutral-950 overflow-hidden flex flex-col justify-between p-8 sm:p-16 border-b border-neutral-200 snap-start transform-gpu">
                <div className="absolute inset-0 bg-architectural-grid bg-size-[4rem_4rem] opacity-10 z-10 pointer-events-none" />
                
                {item.heroImage && (
                    <div className="hero-bg-image absolute inset-0 z-0 select-none pointer-events-none transform-gpu translate-z-0 will-change-transform">
                        <Image 
                            src={item.heroImage} 
                            alt={item.name} 
                            fill 
                            priority
                            className="object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/20 to-transparent z-1" />
                    </div>
                )}
                <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-20 animate-fade-in transform-gpu">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button 
                                onClick={onBack}
                                className="magnetic flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-300 cursor-pointer"
                            >
                                <ArrowLeft size={12} strokeWidth={2.5} /> Return to List
                            </button>
                        )}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-900/60 text-mint-light border border-neutral-800 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={12} /> Institutional System Hub
                        </div>
                    </div>
                    <a 
                        href={item.links?.website} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-neutral-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border-b border-transparent hover:border-white pb-0.5"
                    >
                        <Globe size={12} /> Visit Portal
                    </a>
                </div>
                <div className="w-full max-w-7xl mx-auto z-20 mb-8 transform-gpu">
                    <div className="flex flex-wrap items-center gap-3 mb-6 animate-hero-text">
                        <span className="px-3 py-1 bg-mint-dark text-white text-[10px] font-black uppercase tracking-widest rounded-md shadow-md">
                            Verified Profile Node
                        </span>
                        {narrative?.projected_tf && (
                            <span className="px-3 py-1 bg-neutral-900/60 border border-neutral-800 text-neutral-200 text-[10px] font-black uppercase tracking-widest rounded-md">
                                {narrative.projected_tf}
                            </span>
                        )}
                        <button 
                            onClick={() => toggleFavorite("savedUniversities", item.name)}
                            className={`magnetic py-1 px-2 flex gap-2 cursor-pointer rounded-xl transition-colors duration-300 ${
                                isSaved ? "bg-red-50 text-red-500" : "bg-white/10 text-white hover:bg-white hover:text-black"
                            }`}
                        >
                            <Heart size={16} fill={isSaved ? "currentColor" : "none"} strokeWidth={2} />
                            <span className="text-xs font-bold pr-1">{isSaved ? "Remove from Saved Universities" : "Add to Saved Universities"}</span>
                        </button>
                    </div>
                    <h1 className="animate-hero-text text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter max-w-5xl leading-[0.85] text-balance">
                        {item.name}
                    </h1>
                    <div className="animate-fade-in flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 text-neutral-300 font-bold uppercase text-[9px] sm:text-[11px] tracking-widest border-t border-white/10 pt-8 max-w-3xl">
                        <span className="flex items-center gap-2 text-white">
                            <MapPin size={14} className="text-mint-light" />
                            {item.location?.city || "National Region"} • {item.location?.campus || "Main"} Campus
                        </span>
                    </div>
                </div>
                <button 
                    onClick={() => scrollToSection("match-analysis")}
                    className="locked magnetic absolute bottom-8 right-8 z-20 animate-bounce p-2 rounded-full bg-white text-black border border-neutral-200 shadow-2xl cursor-pointer hover:bg-mint-light hover:text-neutral-950 transition-colors transform-gpu"
                >
                    <ArrowDown size={16} strokeWidth={2.5} />
                </button>
            </section>
            <section id="match-analysis" className="min-h-screen lg:h-screen w-full bg-white flex flex-col justify-center items-center px-6 sm:px-12 py-6 relative border-b border-neutral-200 snap-start">
                <div className="absolute inset-0 bg-radial from-neutral-50/50 via-white to-white pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-mint-dark/5 border border-mint-dark/10 rounded-full text-mint-dark">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Synthetic Engine Recommendation</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-neutral-950 leading-none">
                        Why This Institution Matches Your Vector
                    </h2>
                    <blockquote className="text-xl sm:text-3xl font-medium text-neutral-800 leading-relaxed italic tracking-tight font-serif pt-4 px-4 border-l-2 border-mint-dark/30">
                        &ldquo;{narrative?.why || "Our machine learning frameworks are currently finalizing dynamic qualitative profiling for this institution."}&rdquo;
                    </blockquote>
                    <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest pt-6">
                        Cross-compiled via semantic thesis telemetry and peer records
                    </p>
                </div>
                <button 
                    onClick={() => scrollToSection("metrics-matrix")}
                    className="magnetic locked absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center not-sm:mb-3 sm:gap-2 text-neutral-400 hover:text-neutral-950 transition-colors group cursor-pointer"
                >
                    <span className="text-[9px] font-black uppercase tracking-widest">Operational Metrics</span>
                    <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
                </button>
            </section>
            <section id="metrics-matrix" className="min-h-screen lg:h-screen w-full bg-[#fbfdfb] flex flex-col justify-between p-8 sm:p-16 relative snap-start">
                <div className="w-full max-w-7xl mx-auto my-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Strategic Profile</span>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-neutral-950 leading-none">
                            Operational & Logistics Landscape
                        </h2>
                        <p className="text-neutral-500 text-sm max-w-md font-medium">
                            Real metrics broken down by our indexing engine to help clear up commute friction and baseline tuition requirements.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 w-full">
                        <div className="magnetic bg-white border border-neutral-200/80 p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow duration-300 flex items-start gap-6 group">
                            <div className="p-4 rounded-2xl bg-neutral-950 text-white group-hover:bg-mint-dark group-hover:text-neutral-950 transition-colors">
                                <Coins size={24} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Financial Track</span>
                                <h4 className="text-xl font-bold text-neutral-950 uppercase tracking-tight">Tuition Architecture</h4>
                                <p className="text-neutral-600 text-sm font-medium leading-relaxed">
                                    {narrative?.projected_tf || "Base tuition index maps currently updating across registry servers."}
                                </p>
                            </div>
                        </div>
                        <div className="magnetic bg-white border border-neutral-200/80 p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow duration-300 flex items-start gap-6 group">
                            <div className="p-4 rounded-2xl bg-neutral-950 text-white group-hover:bg-mint-dark group-hover:text-neutral-950 transition-colors">
                                <Car size={24} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Transit Conditions</span>
                                <h4 className="text-xl font-bold text-neutral-950 uppercase tracking-tight">Commute & Environmental Vibe</h4>
                                <p className="text-neutral-600 text-sm font-medium leading-relaxed">
                                    {narrative?.footnotes || "Locational traffic dynamics and student hub notes parsing dynamically."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-7xl mx-auto border-t border-neutral-200/60 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href={item.links?.portal} target="_blank" rel="noreferrer" className="magnetic flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-950 hover:shadow-xs transition-colors group">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700 group-hover:text-neutral-950">Registration Portal</span>
                        <ExternalLink size={12} className="text-neutral-400 group-hover:text-neutral-950 transition-colors" />
                    </a>
                    <a href={item.links?.scholarship} target="_blank" rel="noreferrer" className="magnetic flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-2xl hover:border-mint-dark hover:shadow-xs transition-colors group">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700 group-hover:text-mint-dark">Financial Aid Registry</span>
                        <GraduationCap size={14} className="text-neutral-400 group-hover:text-mint-dark transition-colors" />
                    </a>
                    <a href={item.links?.website} target="_blank" rel="noreferrer" className="magnetic flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-950 hover:shadow-xs transition-colors group">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700 group-hover:text-neutral-950">Official Network Link</span>
                        <Globe size={12} className="text-neutral-400 group-hover:text-neutral-950 transition-colors" />
                    </a>
                </div>
            </section>
        </div>
    );
};