import AppearingText from "@/components/AppearingText";
import Enquire from "@/components/Enquire";
import gsap from "@/modules/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const cardsList = [
    {
        title: "Holistic Counseling",
        img: "/images/hd/pexels-zachary-vessels-26649727-6794181.jpg",
        description: "We provide comprehensive, professional, and personalized guidance for both academic and career paths, ensuring informed, confident decision-making.",
    },
    {
        title: "Personalizable Experience",
        img: "/images/hd/pexels-rdne-7683817.jpg",
        description: "Our services are tailored to individual profiles, empowering you with readied profiles and essential tools to confidently complete all application requirements.",
    },
    {
        title: "Hassle-free",
        img: "/images/hd/pexels-einfoto-2305098.jpg",
        description: "We simplify complex application entries for academic institutions and career opportunities, hosting resources and processes for a reliable, worry-free journey.",
    }
]

function WhyCard({ title, img, description, index, isDesktop }: { title: string, img: string, description: string, index: number, isDesktop: boolean }) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const backdropRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [active, setActive] = useState(false);
    useGSAP(() => {
        const animationConfig = {
            duration: 0.3,
            ease: "power2.out"
        }
        if (imageRef.current)
            gsap.to(imageRef.current, {
                scale: isDesktop && active ? 1.1 : 1,
                ...animationConfig,
            });
        if (backdropRef.current)
            gsap.to(backdropRef.current, {
                opacity: isDesktop && active ? 0.25 : 0.45,
                ...animationConfig,
            });
    }, { scope: cardRef, dependencies: [active] });
    useEffect(() => {
        const card: HTMLDivElement | null = cardRef.current;
        if (!card) return;  
        const handleEnter = () => setActive(true);
        const handeLeave = () => setActive(false);
        card.addEventListener("pointerenter", handleEnter);
        card.addEventListener("pointerleave", handeLeave);
        card.addEventListener("pointerup", handeLeave);
        card.addEventListener("pointerdown", handleEnter);
        card.addEventListener("pointercancel", handeLeave);
        return () => {
            card.removeEventListener("pointerenter", handleEnter);
            card.removeEventListener("pointerleave", handeLeave);
            card.removeEventListener("pointerup", handeLeave);
            card.removeEventListener("pointerdown", handleEnter);
            card.removeEventListener("pointercancel", handeLeave);
        }
    }, [ isDesktop ]);
    
    return (
        <div className="relative h-screen max-h-[50vh] md:max-h-[60vh] flex flex-1 justify-start p-2 items-end size-full overflow-hidden" ref={cardRef}>
            <div className="absolute inset-0 z-0 px-5 py-2.5 text-amber-600">
                <div className="absolute inset-0 h-[120%] origin-bottom" data-speed="auto">
                    <Image src={img} alt="" className="object-cover object-center" fill sizes="(min-width: 66em) 80vw, (min-width: 44em) 50vw, 100vw" ref={imageRef} />
                </div>
                <div className="size-full bg-black opacity-45 absolute inset-0 z-1" ref={backdropRef} />
            </div>
            <AppearingText split="chars" as="p" className="[writing-mode:sideways-lr] bg-[#9dc29f] shadow-sm text-black uppercase px-2 relative z-3 text-base sm:text-xl md:text-3xl font-thin" vertical enableScrollTrigger delay={0.5*index}>
                {`${(index+1).toString()}. ${title}`}
            </AppearingText>
            <AppearingText className="absolute bottom-0 mx-3 mb-3 text-white" enableScrollTrigger delay={0.65*index} split="words" as="p">
                { description }
            </AppearingText>
        </div>
    );
}

export default function IndexWhy() {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia(`(min-width: 768px)`);
        const handleScreenChange = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop(e.matches);
        handleScreenChange(mediaQuery);
        mediaQuery.addEventListener('change', handleScreenChange);
        return () => mediaQuery.removeEventListener('change', handleScreenChange);
    }, []);
    return (
        <section className="relative min-h-screen grid place-items-center px-10 sm:px-25 md:px-40 py-18 sm:py-28 md:py-38 bg-gray-100 overflow-hidden">
            <div className="flex flex-col space-y-5 items-center z-1 w-full max-w-2xl">
                <div className="grid place-items-center">
                    <h3 className="text-sm xs:text-lg sm:text-xl md:text-2xl font-semibold text-neutral-700"> Find <b>HOPE</b> from <b>STAR</b>s above </h3>
                    <AppearingText split="words" as="h2" className="text-xl xs:text-2xl sm:text-4xl md:text-6xl font-black uppercase text-neutral-800" enableScrollTrigger>
                        Why Choose Sobre
                    </AppearingText>
                </div>
                <AppearingText split="words" as="span" enableScrollTrigger className="text-neutral-600">
                    We are a private consulting and opportunities company committed to guiding and
                    empowering individuals on their academic and career journeys. Specializing in holistic and
                    professional services, we simplify complex application processes for students and job seekers
                    alike, ensuring our clients make confident, informed decisions about their future.
                </AppearingText>
                <div className="min-h-[60vh] w-[60vw] grid grid-cols-1 md:grid-cols-3 place-items-center shadow-2xl">
                    { cardsList.map(({ title, description, img }, index) => (
                        <WhyCard isDesktop={isDesktop} title={title} description={description} img={img} key={index} index={index} />
                    )) }
                </div>
                <Enquire label="Need help? — We're here" className="shadow-md" />
            </div>
            <div className="absolute -bottom-1/2 mask-[url(/images/scribble.png)] bg-[url(/images/hd/pexels-shvetsa-11286172.jpg)] size-full bg-cover mask-center mask-no-repeat bg-no-repeat bg-center mask-size-[120%_90%]" />
        </section>
    );
}