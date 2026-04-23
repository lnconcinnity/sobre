"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "../../modules/gsap";

export default function MetricsSection() {
    const sectionRef = useRef(null);
    const tabletRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(tabletRef.current, 
            { 
                rotateX: 45, 
                rotateY: -30, 
                z: -500, 
                opacity: 0 
            },
            {
                rotateX: 10,
                rotateY: -15,
                z: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1,
                }
            }
        );

        gsap.from(".val-prop", {
            y: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
            }
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative z-0 min-h-screen flex items-center py-24 bg-[#263127] overflow-hidden">
            <div className="container mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="z-10">
                    <span className="val-prop block text-mint-light font-black tracking-widest uppercase text-xs mb-4">
                        The Sobre Advantage
                    </span>
                    <h2 className="val-prop text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6 text-white">
                        Clarity over <br/>
                        <span className="italic text-transparent" style={{ WebkitTextStroke: "1.5px white" }}>Clutter.</span>
                    </h2>
                    <p className="val-prop text-white/60 max-w-md text-lg mb-8">
                        Choosing a university shouldn&apos;t be a guessing game. We cut through the noise by providing <strong>verified, human-backed data</strong> and personalized matching for the country&apos;s top institutions.
                    </p>
                    <div className="space-y-6 border-t border-white/10 pt-8">
                        <div className="val-prop flex gap-4 items-start">
                            <div className="shrink-0 mt-1 size-6 rounded-full bg-mint-light/20 flex items-center justify-center text-mint-light">
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Verified Authenticity</h3>
                                <p className="text-sm text-white/40">No AI hallucinations. Just accurate, up-to-date program requirements and real student feedback.</p>
                            </div>
                        </div>
                        
                        <div className="val-prop flex gap-4 items-start">
                            <div className="shrink-0 mt-1 size-6 rounded-full bg-mint-light/20 flex items-center justify-center text-mint-light">
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Optimized Placement</h3>
                                <p className="text-sm text-white/40">Our Academic Finder maps your unique profile directly to schools where you are most likely to succeed.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="perspective-2000 py-20 lg:pl-10">
                    <div 
                        ref={tabletRef}
                        className="preserve-3d relative mx-auto w-full max-w-lg aspect-3/4 md:aspect-4/3 rounded-[3rem] border border-white/20 bg-white/10 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.3)] ring-1 ring-white/10"
                    >
                        <div className="p-8 h-full flex flex-col justify-between backface-hidden">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-mint-dark rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
                                    <div>
                                        <p className="text-xs font-bold leading-none text-white">Academic Finder</p>
                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Live Database</p>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-400">Active</span>
                                </div>
                            </div>

                            <div className="flex-1 py-6 flex flex-col justify-center space-y-4">
                                <div className="bg-white/10 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Partner Network</p>
                                        <span className="text-[9px] bg-mint-dark text-white px-2 py-0.5 rounded-full">B2B Verified</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-black text-white">100%</p>
                                        <p className="text-xs font-medium text-white/40 mb-1">Direct Institution Links</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-mint-dark p-5 rounded-2xl shadow-lg shadow-black/20 text-white flex flex-col justify-between relative overflow-hidden border border-white/10">
                                        <div className="absolute -right-4 -top-4 size-16 bg-white/10 rounded-full blur-xl" />
                                        <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-3 z-10">Exam Focus</p>
                                        <div className="z-10">
                                            <p className="text-2xl font-black">UPCAT</p>
                                            <p className="text-2xl font-black opacity-30">USTET</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                                        <p className="text-[10px] uppercase tracking-widest text-mint-light font-bold mb-3">Profile Matches</p>
                                        <div>
                                            <p className="text-3xl font-black text-white">500+</p>
                                            <p className="text-[10px] text-white/40 font-medium">Students placed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-24 h-1.5 bg-white/10 mx-auto rounded-full" />
                        </div>
                        <div className="absolute inset-0 rounded-[3rem] bg-linear-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-800px h-full opacity-5 pointer-events-none -z-10 rotate-12 translate-x-1/3">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#87df90" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.1,-46.3C90.4,-33.5,96,-18.1,95.3,-3.1C94.6,11.9,87.6,26.5,77.5,38.5C67.4,50.5,54.3,59.9,40.6,67.3C26.9,74.7,13.4,80.1,-1.1,82C-15.6,83.9,-31.2,82.3,-44.6,74.5C-58,66.7,-69.2,52.7,-76.7,37.3C-84.2,21.9,-88,5.1,-85.7,-10.8C-83.4,-26.7,-75,-41.7,-63.3,-53.4C-51.6,-65.1,-36.6,-73.5,-21.8,-76.6C-7,-79.7,7.8,-77.5,21.8,-73.7L44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>
        </section>
    );
}