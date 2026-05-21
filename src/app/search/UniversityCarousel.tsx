/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState, useEffect } from "react";
import { GraduationCap, MapPin, CircleDollarSign, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import Image from "next/image";

interface UniversityProvider {
    universitySlug: string;
    universityName: string;
    college_name: string;
    offered_majors?: string[] | string;
    majors?: string;
    tuition_range?: { min: any };
    tuition?: any;
    heroImage?: string;
}

interface UniversityCarouselProps {
    providers: UniversityProvider[];
    narrativeAnalysis?: any;
}

export function UniversityCarousel({ providers, narrativeAnalysis }: UniversityCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const activeProviders = providers || [];
    const [touchStart, setTouchStart] = useState<number | null>(null);
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentIndex(0);
        if (trackRef.current) {
            gsap.killTweensOf(trackRef.current);
            gsap.set(trackRef.current, { xPercent: 0 });
        }
    }, [providers]);

    const handleSlide = (targetIndex: number) => {
        if (targetIndex < 0 || targetIndex >= activeProviders.length) return;
        
        setCurrentIndex(targetIndex);
        if (trackRef.current) {
            gsap.to(trackRef.current, {
                xPercent: -targetIndex * 100,
                duration: 0.45,
                ease: "power2.out"
            });
        }
    };
    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) handleSlide(Math.min(currentIndex + 1, activeProviders.length - 1));
            else handleSlide(Math.max(currentIndex - 1, 0));
        }
        setTouchStart(null);
    };

    if (activeProviders.length === 0) {
        return (
            <div className="w-full h-full min-h-96 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center">
                <ShieldAlert className="text-neutral-400 mb-2" size={24} />
                <h4 className="text-sm font-black uppercase text-neutral-800">No Verified Institutional Provisioning</h4>
                <p className="text-neutral-400 text-xs mt-1 max-w-xs font-medium">
                    Admissions matrix data is pending manual curriculum auditing for this specialized pathway.
                </p>
            </div>
        );
    }

    return (
        <div 
            className="w-full flex flex-col justify-between h-full relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="w-full overflow-hidden rounded-2xl relative">
                <div 
                    ref={trackRef}
                    className="flex w-full will-change-transform"
                    style={{ display: "flex" }}
                >
                    {activeProviders.map((uni, idx) => {
                        const programData = narrativeAnalysis; 
                        const analysisArray = Array.isArray(programData) ? programData : [];
                        const specificSchoolAnalysis = analysisArray.find(
                            (item: any) => item.uni_slug === uni.universitySlug
                        )?.analysis || null;
                        const estimatedTuition = uni.tuition_range?.min ?? uni.tuition;
                        const toTitleCase = (str: string) => 
                            str.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
                        const structuralMajors = Array.isArray(uni.offered_majors) 
                            ? uni.offered_majors.map((major: string) => toTitleCase(major)).join(", ") 
                            : toTitleCase(uni.majors || "General Path");
                        return (
                            <div 
                                key={uni.universitySlug || idx} 
                                className="w-full shrink-0 px-1"
                                style={{ width: "100%" }}
                            >
                                <div className="w-full bg-white border border-neutral-100 rounded-2xl shadow-xs flex flex-col justify-between min-h-112 overflow-hidden">
                                    {uni.heroImage && (
                                        <div className="w-full h-32 relative overflow-hidden bg-neutral-100 shrink-0">
                                            <Image 
                                                src={uni.heroImage} 
                                                alt={`${uni.universityName} Campus`} 
                                                fill
                                                className="object-cover object-center"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-4 p-6 grow">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-xl bg-neutral-900 text-white mt-1 shrink-0">
                                                <GraduationCap size={16} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-neutral-950 uppercase tracking-tight leading-tight">
                                                    {uni.universityName}
                                                </h3>
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mt-0.5">
                                                    {uni.college_name || "General Academic Cluster"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 border-y border-neutral-50 py-3.5 my-1">
                                            <div className="flex items-center gap-2">
                                                <CircleDollarSign size={14} className="text-mint-dark shrink-0" />
                                                <div>
                                                    <span className="block text-[8px] font-black uppercase text-neutral-400 tracking-wider">Est. Base Tuition</span>
                                                    <span className="text-xs font-extrabold text-neutral-800">
                                                        {estimatedTuition && estimatedTuition !== "Unavailable" && estimatedTuition !== 0 
                                                            ? `₱${Number(estimatedTuition).toLocaleString()}/sem` 
                                                            : estimatedTuition === 0 ? "FREE (State Uni)" : "Unavailable"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-neutral-400 shrink-0" />
                                                <div>
                                                    <span className="block text-[8px] font-black uppercase text-neutral-400 tracking-wider">Tracks Offered</span>
                                                    <span className="text-xs font-extrabold text-neutral-800 truncate block max-w-40">
                                                        {structuralMajors}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {specificSchoolAnalysis ? (
                                            <div className="mt-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-mint-dark block mb-1">
                                                    Strategic Institutional Take
                                                </span>
                                                <p className="text-neutral-600 text-xs font-medium leading-relaxed whitespace-pre-line">
                                                    {specificSchoolAnalysis}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mt-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
                                                    Program Profile Insight
                                                </span>
                                                <p className="text-neutral-500 text-xs italic font-medium leading-relaxed">
                                                    This provider emphasizes rigorous technical board training alongside dynamic industrial mentorship placements.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="text-[9px] font-black text-neutral-300 uppercase tracking-widest self-end p-6 pt-0">
                                        Verified Platform Asset
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {activeProviders.length > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Provider <span className="text-neutral-900 font-black">{currentIndex + 1}</span> of {activeProviders.length}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button 
                            disabled={currentIndex === 0}
                            onClick={() => handleSlide(currentIndex - 1)}
                            className="magnetic rounded-full p-1.5 border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <ChevronLeft size={14} strokeWidth={2.5} />
                        </button>
                        <button 
                            disabled={currentIndex === activeProviders.length - 1}
                            onClick={() => handleSlide(currentIndex + 1)}
                            className="magnetic rounded-full p-1.5 border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <ChevronRight size={14} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}