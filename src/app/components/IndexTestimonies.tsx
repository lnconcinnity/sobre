import AppearingText from "@/components/AppearingText";
import Enquire from "@/components/Enquire";
import gsap from "@/modules/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const testimoniesData = [
    {
        roster: "/images/temp/download (1).jpeg",
        quote: "The admissions strategy was clear and comprehensive. Thanks to their guidance, I secured my place at my first-choice university. Highly recommend for any ambitious student navigating the application process.",
        author: "Jane P. Smith",
        title: "Admitted Student, Top-Tier University"
    },
    {
        roster: "/images/temp/download.jpeg",
        quote: "Their career counseling opened my eyes to paths I hadn't considered. They helped me articulate my strengths and build a portfolio that truly stands out. A pivotal resource for professional development.",
        author: "John F. Doe",
        title: "Young Professional, Tech Industry"
    },
    {
        roster: "/images/temp/download (3).jpeg",
        quote: "My standardized test scores improved dramatically after using their targeted tutoring methods. The instructors are exceptional and truly understand how to break down complex material.",
        author: "Amelia R. Jones",
        title: "High School Senior, Test Prep Client"
    },
    {
        roster: "/images/temp/download (6).jpeg",
        quote: "As a parent, the process of finding the right boarding school was overwhelming. The consultant provided tailored recommendations and critical insight, making the entire journey manageable and successful.",
        author: "Robert M. Brown",
        title: "Parent of a Private School Applicant"
    },
    {
        roster: "/images/temp/download (4).jpeg",
        quote: "The personalized essay editing service was fantastic. They didn't change my voice, but helped me refine my personal narrative to be impactful and compelling to the admissions committee.",
        author: "Lisa T. Davis",
        title: "Graduate Program Applicant"
    },
    {
        roster: "/images/temp/download (2).jpeg",
        quote: "Their expertise in international educational transfers saved me months of confusion and paperwork. Professional, efficient, and deeply knowledgeable about global curriculum alignment.",
        author: "Michael S. White",
        title: "International Student Advisor"
    },
    {
        roster: "/images/temp/download (5).jpeg",
        quote: "We partnered with them to train our teaching staff on new pedagogical techniques. The workshops were engaging, relevant, and immediately applicable, resulting in better student engagement.",
        author: "Sarah K. Wilson",
        title: "School Administrator, Local District"
    },
];

const getVisibleCardCount = () => {
    return window.innerWidth >= 768 ? 3 : 1;
};

export default function IndexTestimonies() {
    const [visibleCards, setVisibleCards] = useState(3);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const carouselRef = useRef(null);
    const totalCards = testimoniesData.length;
    const CARD_WIDTH = 100 / visibleCards;
    const maxMoves = totalCards - visibleCards + 1 + (totalCards % 2);
    const transformValue = currentSlideIndex * CARD_WIDTH * -1;
    const isMobile = visibleCards === 1;
    const displayedTestimonials = isMobile 
        ? testimoniesData.slice(0, 3) 
        : testimoniesData;
    useGSAP(() => {
        const carouselElement = carouselRef.current;
        if (!carouselElement) return;
        gsap.to(carouselElement, {
            x: `${transformValue}%`,
            duration: 0.75,
            ease: "power3.out",
        });
    }, [currentSlideIndex, transformValue]);
    useEffect(() => {
        const handleResize = () => {
            const newVisibleCards = getVisibleCardCount();
            setVisibleCards(newVisibleCards);
            const newMaxMoves = totalCards - newVisibleCards;
            setCurrentSlideIndex(prev => Math.min(prev, newMaxMoves));
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [totalCards]);
    const nextSlide = () => setCurrentSlideIndex((prev) => Math.min(prev + 1, maxMoves));
    const prevSlide = () => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));

    return (
        <section className="min-h-screen relative grid place-items-center px-15 pt-40 pb-25">
            <div className="absolute inset-0 size-full">
                <Image src="/images/hd/pexels-expressivestanley-1454360.jpg" fill sizes="(min-width: 66em) 80vw, (min-width: 44em) 50vw, 100vw" className="object-cover object-center z-0" alt="" />
                <div className="absolute size-full inset-0 bg-[#364137] z-1 opacity-90"/>
            </div>
            <div className="relative size-full z-2 max-w-6xl px-5 md:px-15">
                <div className="absolute inset-0 bg-[#364137] w-full md:w-[80%]"/>
                <div className="p-8 size-36 grid place-items-center bg-[#4c5f4d] absolute rounded-full -translate-y-1/2 left-1/2 -translate-x-1/2 md:translate-x-15">
                    <span className="text-9xl font-serif text-white font-black"> &ldquo; </span>
                </div>
                <div className="relative w-full h-full grid grid-cols-1 md:grid-cols-3 place-items-center-safe gap-5 py-18">
                    <AppearingText enableScrollTrigger stagger={0.25}>
                        <div className="flex flex-col items-start justify-center space-y-5 text-white text-left px-5">
                            <div className="overflow-hidden"><h5 className="font-bold text-2xl not-md:text-center"> Hear what others say </h5></div>
                            <div className="overflow-hidden"><p className="not-md:text-sm"> Get insights from our clients and partners, showcasing the multitudes of paths guided and paved </p></div>
                            <div className="overflow-hidden"><Enquire label="Give us your thoughts" filled={false} className="text-sm" /></div>
                        </div>
                    </AppearingText>
                    <div className="col-span-2 relative w-[110%] not-md:w-full">
                        <div className="md:overflow-hidden">
                            <div 
                                ref={carouselRef} 
                                className={`md:flex flex-nowrap items-center w-full ${isMobile ? 'h-auto' : 'h-[40vh]'}`}
                                style={!isMobile ? { width: `${(totalCards / visibleCards) * 100}%` } : {}}
                            >
                                {displayedTestimonials.map((testimony, index) => (
                                    <div 
                                        key={index} 
                                        style={!isMobile ? { width: `${CARD_WIDTH}%` } : {}}
                                        className={`shrink-0 p-4 ${isMobile ? 'w-full' : 'md:w-[33.333333%]'} `}
                                    >
                                        <div className="bg-gray-100 shadow-lg h-full rounded-lg p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                                            <p className="text-sm xs:text-base sm:text-lg md:text-xl italic text-[#364137] leading-snug">
                                                &ldquo;{testimony.quote}&rdquo;
                                            </p>
                                            <div className="pt-2 mt-2 sm:pt-4 sm:mt-4 md:pt-6 md:mt-6 border-t border-gray-300 flex items-center space-x-4">
                                                <div className="relative size-16 rounded-full overflow-hidden shrink-0">
                                                    <Image 
                                                        src={testimony.roster} 
                                                        alt={`Profile picture of ${testimony.author}`} 
                                                        fill 
                                                        sizes="64px" 
                                                        className="object-cover object-center" 
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="font-bold text-xs sm:text-sm md:text-base text-[#364137]">{testimony.author}</h6>
                                                    <p className="text-[0.7rem] sm:text-xs md:text-sm opacity-75 text-[#4c5f4d]">{testimony.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {!isMobile && (
                            <div className="absolute -bottom-16 left-5 flex space-x-4 z-10">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentSlideIndex === 0}
                                    aria-label="Previous testimony"
                                    className="p-3 bg-gray-200 enabled:hover:bg-gray-300 disabled:opacity-50 text-[#364137] rounded-full transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    disabled={currentSlideIndex === maxMoves}
                                    aria-label="Next testimony"
                                    className="p-3 bg-gray-200 enabled:hover:bg-gray-300 disabled:opacity-50 text-[#364137] rounded-full transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}