import Enquire from "@/components/Enquire";
import AppearingText from "@/components/AppearingText"; // Assuming this path
import Image from "next/image";
import { useRef } from "react";

const proceduresList = [
    {
        title: "Holistic Consultation",
        description: "Receive comprehensive, professional, and personalized guidance to map out your academic and career future, ensuring every decision is informed and confident.",
        img: "/images/hd/pexels-mart-production-7223026.jpg",
    },
    {
        title: "Worry-free Processes",
        description: "Experience simplified and streamlined application entries for both academic institutions and career opportunities, taking the complexity out of the process for you.",
        img: "/images/hd/pexels-kindelmedia-7688190.jpg",
    },
    {
        title: "Path Guided and Paved",
        description: "Be equipped with readied profiles and essential tools, ensuring a smooth completion of all application requirements and empowering you toward your goals.",
        img: "/images/hd/pexels-expressivestanley-1454360.jpg",
    },
]

function ProceduresSection({ title, img, description, index }: { title: string, img: string, description: string, index: number }) {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    return (
        <div className="relative flex flex-1 overflow-hidden" ref={sectionRef}>
            <div className="relative w-full">
                <div className="absolute inset-0 h-[120%] origin-bottom" data-speed="auto">
                    <Image src={img} alt="" className="object-cover object-center" fill sizes="(min-width: 66em) 80vw, (min-width: 44em) 50vw, 100vw" />
                </div>
                <div className="size-full bg-black opacity-65 absolute inset-0 z-1" />
            </div>
            <div className="absolute inset-0 flex not-sm:flex-col z-2 p-8 sm:px-16 md:px-28 select-text">
                <div className="grid flex-1 text-amber-600 text-3xl sm:text-5xl md:text-7xl font-thin justify-start items-start select-none">
                    <AppearingText 
                        enableScrollTrigger
                        start="top 80%"
                        duration={0.8}
                        as="p"
                    >
                        { (index+1).toString() }
                    </AppearingText>
                </div>
                <div className="flex flex-col flex-1 justify-end w-full max-w-md text-white">
                    <AppearingText 
                        enableScrollTrigger
                        start="top 90%"
                        delay={0.2}
                        duration={0.8}
                        as="p"
                        className="md:text-lg sm:text-base text-sm font-bold"
                    >
                        { title }
                    </AppearingText>
                    <AppearingText 
                        enableScrollTrigger
                        start="top 90%"
                        delay={0.4}
                        duration={0.8}
                        as="p"
                        className="sm:text-sm text-xs"
                    >
                        { description }
                    </AppearingText>
                </div>
            </div>
        </div>
    );
}

export default function IndexProcedures() {
    return (
        <section className="h-[150vh] flex flex-col">
            <div className="h-full flex flex-col">
                { proceduresList.map(({ title, img, description }, index) => <ProceduresSection title={title} img={img} description={description} index={index} key={index} />) }
            </div>
            <div className="flex justify-center pt-5 pb-15">
                <Enquire label="Question? — Contact Us" className="shadow-md" />
            </div>
        </section>
    );
}