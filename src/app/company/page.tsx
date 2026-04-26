"use client";
import { useRef } from "react";
import { useGSAP } from "../../modules/gsap";
import gsap from "gsap";
import Image from "next/image";

const teamMembers = [
    {
        name: "Gian Dwayne Romero",
        role: "Chairman",
        roster: "/company-roster/romero.png",
    },
    {
        name: "Zacci Pedrigal",
        role: "Vice Chairman",
        roster: "/company-roster/pedrigal.png",
    },
    {
        name: "Daniel Jose Bartolo",
        role: "Financial Manager",
        roster: "/company-roster/bartolo.png",
    },
    {
        name: "Mark Joseph De Luna",
        role: "Human Resources Manager",
        roster: "/company-roster/deluna.png",
    },
    {
        name: "David Clark Raagas",
        role: "Head of Operations",
        roster: "/company-roster/raagas.png",
    },
    {
        name: "Laurence Jake Cayabyab",
        role: "Head of Affairs",
        roster: "/company-roster/cayabyab.png",
    },
    {
        name: "Levian Ryel Banot",
        role: "Head of Marketing",
        roster: "/company-roster/banot.png",
    },
    {
        name: "Agiellos Lyeojandro Biscocho",
        role: "Head Clientele Agent",
        roster: "/company-roster/biscocho.png",
    },
    {
        name: "Jearvin Marcy Kabigting",
        role: "Clientele Agent",
        roster: "/company-roster/kabigting.png",
    },
    {
        name: "Clarence Benedict Gersava",
        role: "Field Supervisor",
        roster: "/company-roster/gersava.png",
    },
    {
        name: "Jeremie Garcia",
        role: "Field Supervisor",
        roster: "/company-roster/garcia.png",
    },
]

export default function CompanyPage() {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(".reveal-text", { 
            y: 40, 
            opacity: 0, 
            stagger: 0.1, 
            duration: 1, 
            ease: "power4.out" 
        })
        .from(".glass-panel", {
            backdropFilter: "blur(0px)",
            backgroundColor: "rgba(255, 255, 255, 0)",
            border: "1px solid rgba(255, 255, 255, 0)",
            duration: 1.5,
            ease: "power2.inOut"
        }, "-=0.8");
    }, { scope: container });

    return (
        <div ref={container} className="min-h-screen bg-[#f8faf9] py-32 px-6 md:px-16 relative">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] size-150 rounded-full bg-mint-light/10 blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] size-125 rounded-full bg-mint-dark/5 blur-[100px]" />
            </div>
            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-7">
                            <span className="reveal-text block text-mint-dark font-black tracking-[0.3em] uppercase text-[10px] mb-4">
                                Company Profile
                            </span>
                            <h1 className="reveal-text text-6xl md:text-8xl font-black text-neutral-900 uppercase leading-[0.85] mb-12">
                                The <br/>
                                <span className="italic text-transparent" style={{ WebkitTextStroke: "1px #263127" }}>Sobre</span> <br/>
                                Legacy
                            </h1>
                            <div className="reveal-text glass-panel bg-white/30 backdrop-blur-md border border-white/40 p-8 md:p-12 rounded-4xl shadow-sm">
                                <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed italic font-medium">
                                    &quot;No matter whether they were accepted or not, the recipient, in the end, would receive a mailed message physically or digitally—often referred to as a <span className="text-neutral-900 font-bold underline decoration-mint-dark/30 underline-offset-4">letter</span>.&quot;
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-5 lg:pt-32">
                            <div className="reveal-text space-y-8 text-neutral-500 text-base md:text-lg leading-relaxed">
                                <p>
                                    Derived from the Tagalog word for <span className="text-neutral-900 font-bold italic">“Envelope,”</span> the name was chosen to capture the deep, passionate nuance of Filipino culture. We move away from generic terms like &apos;mail&apos; or &apos;letter&apos; to strike the literary hearts of our clients.
                                </p>
                                <p>
                                    Based in the heart of <span className="text-neutral-900 font-semibold">Bonifacio Global City</span>, Sobre operates as a private consulting and opportunities firm committed to bridging the gap between local talent and institutional opportunity.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200/50 border border-neutral-200/50 rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="glass-panel bg-white p-12 md:p-20 flex flex-col justify-between group">
                        <div>
                            <div className="size-3 bg-mint-dark rounded-full mb-8 group-hover:scale-150 transition-transform" />
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-400 mb-12">Vision Statement</h2>
                            <p className="text-3xl md:text-4xl font-black text-neutral-900 uppercase leading-none mb-6">
                                Leading a <br/>
                                <span className="text-mint-dark">Student-First</span> <br/>
                                Future.
                            </p>
                        </div>
                        <p className="text-neutral-500 leading-relaxed max-w-sm">
                            Promoting autonomous and confident decision-making on career and educational paths—ensuring everyone is seen as a student in a continuous journey of growth.
                        </p>
                    </div>
                    <div className="glass-panel bg-[#fcfdfc] p-12 md:p-20 flex flex-col justify-between group">
                        <div>
                            <div className="size-3 border border-mint-dark rounded-full mb-8 group-hover:rotate-45 transition-transform" />
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-400 mb-12">Mission Statement</h2>
                            <p className="text-3xl md:text-4xl font-black text-neutral-900 uppercase leading-none mb-6 italic">
                                Simplifying <br/>
                                The <span className="text-transparent" style={{ WebkitTextStroke: "1px black" }}>Complex</span>
                            </p>
                        </div>
                        <p className="text-neutral-500 leading-relaxed max-w-sm">
                            Committed to delivering professional, holistic, and personal services catered to individual profiles that simplify the application entries for both academic and career pathways.
                        </p>
                    </div>
                </section>
                <section className="mt-40">
                    <div className="mb-20">
                        <span className="reveal-text block text-mint-dark font-black tracking-[0.3em] uppercase text-[10px] mb-4">
                            Organizational Structure
                        </span>
                        <h2 className="reveal-text text-5xl md:text-7xl font-black text-neutral-900 uppercase leading-none">
                            The <span className="italic text-transparent" style={{ WebkitTextStroke: "1px #263127" }}>Mindset</span> <br/>
                            Behind Sobre
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, i) => (
                            <div 
                                key={i} 
                                className="locked magnetic glass-panel group relative aspect-4/5 overflow-hidden rounded-4xl bg-neutral-900 border border-white/10 shadow-sm transition-all duration-500 hover:shadow-2xl"
                            >
                                <div className="absolute inset-0 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out">
                                    <div className="absolute inset-0 bg-neutral-800" />
                                    <Image
                                        src={member.roster} 
                                        alt={member.name}
                                        fill
                                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-900/20 to-transparent opacity-90" />
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-8 z-10 translate-y-0 group-hover:-translate-y-35 transition-transform duration-500 ease-out">
                                    <p className="text-[10px] font-black text-mint-light uppercase tracking-[0.2em] mb-2">
                                        {member.role}
                                    </p>
                                    <h4 className="text-3xl font-black text-white uppercase leading-[0.8] tracking-tighter drop-shadow-md">
                                        {member.name.split(' ').map((n, j) => (
                                            <span key={j} className="block">{n}</span>
                                        ))}
                                    </h4>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-neutral-950/90 backdrop-blur-xl border-t border-white/10 h-40 flex flex-col justify-center">
                                    <p className="text-[10px] font-bold text-mint-light uppercase mb-3 tracking-widest">Profile Abstract</p>
                                    <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                                        Commitment to delivering professional, holistic, and personal services tailored to individual student profiles to simplify complex academic pathways.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}