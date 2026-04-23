"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "../../modules/gsap";
import Image from "next/image";

const testimoniesData = [
    {
        roster: "/temp/download (1).jpeg",
        quote: "The admissions strategy was clear and comprehensive. Thanks to their guidance, I secured my place at my first-choice university. Highly recommend for any ambitious student navigating the application process.",
        author: "Jane P. Smith",
        title: "Admitted Student, Top-Tier University",
        tag: "Career"
    },
    {
        roster: "/temp/download.jpeg",
        quote: "Their career counseling opened my eyes to paths I hadn't considered. They helped me articulate my strengths and build a portfolio that truly stands out. A pivotal resource for professional development.",
        author: "John F. Doe",
        title: "Young Professional, Tech Industry",
        tag: "Career"
    },
    {
        roster: "/temp/download (3).jpeg",
        quote: "My standardized test scores improved dramatically after using their targeted tutoring methods. The instructors are exceptional and truly understand how to break down complex material.",
        author: "Amelia R. Jones",
        title: "High School Senior, Test Prep Client",
        tag: "Preparation"
    },
    {
        roster: "/temp/download (6).jpeg",
        quote: "As a parent, the process of finding the right boarding school was overwhelming. The consultant provided tailored recommendations and critical insight, making the entire journey manageable and successful.",
        author: "Robert M. Brown",
        title: "Parent of a Private School Applicant",
        tag: "Education"
    },
    {
        roster: "/temp/download (4).jpeg",
        quote: "The personalized essay editing service was fantastic. They didn't change my voice, but helped me refine my personal narrative to be impactful and compelling to the admissions committee.",
        author: "Lisa T. Davis",
        title: "Graduate Program Applicant",
        tag: "Creative"
    },
    {
        roster: "/temp/download (2).jpeg",
        quote: "Their expertise in international educational transfers saved me months of confusion and paperwork. Professional, efficient, and deeply knowledgeable about global curriculum alignment.",
        author: "Michael S. White",
        title: "International Student Advisor",
        tag: "Global"
    },
    {
        roster: "/temp/download (5).jpeg",
        quote: "We partnered with them to train our teaching staff on new pedagogical techniques. The workshops were engaging, relevant, and immediately applicable, resulting in better student engagement.",
        author: "Sarah K. Wilson",
        title: "School Administrator, Local District",
        tag: "Partnership"
    },
];

export default function TestimonialsSection() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".honey-card", {
            scale: 0.8,
            opacity: 0,
            y: 40,
            stagger: {
                amount: 1,
                grid: "auto",
                from: "center"
            },
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="pt-32 bg-[#f9fdf9] overflow-hidden">
            <div className="container mx-auto px-8">
                <div className="text-center mb-20">
                    <span className="block text-mint-dark font-black tracking-widest uppercase text-xs mb-4">
                        The Success Network
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase text-neutral-900 leading-none">
                        Proven <span className="italic text-transparent" style={{ WebkitTextStroke: "1px black" }}>Results.</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {testimoniesData.map((t, i) => (
                        <div 
                            key={i}
                            className={`magnetic honey-card group relative p-8 rounded-[2.5rem] border border-black/20 hover:shadow-2xl hover:shadow-mint-dark/10
                                ${i === 1 || i === 4 ? 'bg-mint-dark text-white' : 'bg-white/60 backdrop-blur-xl text-neutral-900'}
                                ${i === 6 ? 'lg:col-span-3 lg:flex lg:items-center lg:gap-12' : ''}
                            `}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                                        ${i === 1 || i === 4 ? 'bg-white/20 text-white' : 'bg-mint-light/20 text-mint-dark'}
                                    `}>
                                        {t.tag}
                                    </span>
                                    <span className="text-3xl font-serif opacity-20">“</span>
                                </div>

                                <p className={`text-lg font-medium leading-tight mb-8 ${i === 1 || i === 4 ? 'text-white' : 'text-neutral-700'}`}>
                                    {t.quote}
                                </p>

                                <div className="mt-auto flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-neutral-200 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                                        <Image src={t.roster} alt={t.author} width={40} height={40} />
                                    </div>
                                    <div>
                                        <p className="font-black uppercase text-[11px] tracking-tight">{t.author}</p>
                                        <p className={`text-[10px] font-medium opacity-60`}>{t.title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}