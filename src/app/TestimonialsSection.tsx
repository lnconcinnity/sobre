"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "../modules/gsap";
import Image from "next/image";
import { Quote, Sparkles, Star } from "lucide-react";

const testimoniesData = [
    {
        roster: "/temp/download (1).jpeg",
        quote: "The admission path mapping tools made everything so straightforward. I checked the platform daily to monitor my exam schedules and successfully secured my priority slot!",
        author: "Maria Jasmine Santos",
        title: "Incoming Freshman, Top Tier University",
        tag: "Applicant",
        featured: false
    },
    {
        roster: "/temp/download.jpeg",
        quote: "Surviving the college entrance exam season was an absolute nightmare until I found this dashboard. The verified analytics saved me hours of clutter and guessing games.",
        author: "Ethan Gabriel Cruz",
        title: "UPCAT Passer & Scholar",
        tag: "Verified Success",
        featured: true
    },
    {
        roster: "/temp/download (3).jpeg",
        quote: "As a parent, tracking closing application deadlines across multiple university portals was overwhelming. Having clean, centralized data kept our family completely sane.",
        author: "Consuelo D. Ramos",
        title: "Parent of a High School Senior",
        tag: "Parent Perspective",
        featured: false
    },
    {
        roster: "/temp/download (6).jpeg",
        quote: "I use the discussion boards to share tips about my course curriculum. Being able to mentor the next batch of applicants directly is an incredibly rewarding loop.",
        author: "Kevin Alejandro V.",
        title: "UST Accountancy Alumnus",
        tag: "Alumni Insight",
        featured: false
    },
    {
        roster: "/temp/download (4).jpeg",
        quote: "The personalized portal matching engine pointed me toward specialized engineering tracks I hadn't even considered. It totally reshaped my academic trajectory.",
        author: "Lara Beatrice Villanueva",
        title: "DOST Scholar / Engineering Student",
        tag: "Academic Match",
        featured: true
    },
    {
        roster: "/temp/download (2).jpeg",
        quote: "The direct links to specific campus administrative offices saved our class months of validation paperwork during our final high school tracking transitions.",
        author: "Mr. Roderick Castro",
        title: "Senior High School Guidance Counselor",
        tag: "Stakeholder",
        featured: false
    },
];

export default function TestimonialsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        gsap.from(".title-reveal", {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 85%",
            }
        });
        gsap.fromTo(".honey-card", 
            {
                scale: 0.9,
                opacity: 0,
                y: 50
            },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                stagger: {
                amount: 0.8,
                grid: "auto",
                from: "start"
                },
                duration: 1.4,
                ease: "expo.out",
                scrollTrigger: {
                trigger: containerRef.current,
                start: "top 65%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="pt-24 md:pt-32 bg-[#f9fdf9] overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                <div ref={headerRef} className="text-center mb-16 md:mb-24">
                    <span className="title-reveal inline-flex items-center gap-1.5 text-mint-dark font-black tracking-widest uppercase text-xs mb-4 bg-mint-light/10 px-3 py-1 rounded-full border border-mint-dark/10">
                        <Sparkles className="size-3.5 text-mint-dark" /> Proven Results
                    </span>
                    <h2 className="title-reveal text-4xl sm:text-5xl md:text-7xl font-black uppercase text-neutral-900 leading-none tracking-tight">
                        The Stakeholder <br className="sm:hidden" />
                        <span className="italic text-transparent" style={{ WebkitTextStroke: "1.5px #171717" }}>Network.</span>
                    </h2>
                    <p className="title-reveal text-neutral-500 max-w-md mx-auto mt-4 text-sm sm:text-base">
                        Real insights from the students, parents, and mentors navigating the competitive Philippine university landscape.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimoniesData.map((testimonial, index) => (
                        <div 
                            key={index}
                            className={`magnetic honey-card group relative p-6 sm:p-8 rounded-4xl md:rounded-[2.5rem] border border-black/10 transition-shadow duration-500 hover:shadow-2xl hover:shadow-mint-dark/10 flex flex-col justify-between
                                ${testimonial.featured 
                                ? 'bg-[#263127] text-white border-white/10 shadow-lg' 
                                : 'bg-white/70 backdrop-blur-xl text-neutral-900'
                                }
                            `}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border
                                        ${testimonial.featured 
                                        ? 'bg-white/10 text-mint-light border-white/10' 
                                        : 'bg-mint-light/20 text-mint-dark border-mint-dark/10'
                                        }
                                    `}>
                                        {testimonial.tag}
                                    </span>
                                    <Quote className={`size-6 opacity-20 transform rotate-180 ${testimonial.featured ? 'text-mint-light' : 'text-mint-dark'}`} />
                                </div>
                                <p className={`text-base sm:text-lg font-medium leading-snug mb-8 tracking-tight
                                    ${testimonial.featured ? 'text-white/90' : 'text-neutral-700'}
                                    `}>
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-black/5 flex items-center gap-4">
                                <div className="size-11 rounded-full bg-neutral-100 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-300 border border-black/5 shrink-0">
                                    <Image 
                                        src={testimonial.roster} 
                                        alt={testimonial.author} 
                                        fill
                                        sizes="44px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-black uppercase text-[11px] tracking-wide truncate">{testimonial.author}</p>
                                    {testimonial.featured ? (
                                        <div className="flex items-center gap-1 mt-0.5">
                                        <div className="flex gap-0.5 text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="size-2 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-bold text-mint-light/70 ml-1">Top Contributor</span>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] font-medium opacity-50 truncate">{testimonial.title}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}