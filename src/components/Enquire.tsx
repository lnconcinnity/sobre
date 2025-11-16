import clsx from "clsx";
import RollingText from "./RollingText";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/modules/gsap";
import { useTransition } from "@/hooks/useTransition";

const RightArrow = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
)

export default function Enquire({ label = "Enquire now", className, filled = true }: { label?: string, className?: string, filled?: boolean }) {
    const arrowsContainerRef = useRef<HTMLDivElement | null>(null); 
    const { startTransition } = useTransition();
    const [hovered, setHovered] = useState(false);
    const duration = 0.5;
    useGSAP(() => {
        if (!arrowsContainerRef.current) return;
        if (hovered)
            gsap.timeline()
                .to(".arrow-right", {
                    xPercent: 100,
                    duration: duration,
                    ease: "power2.out"
                }, 0)
                .to(".arrow-left", {
                    xPercent: 0,
                    duration: duration,
                    ease: "power2.out"
                }, 0)
        else
            gsap.timeline()
                .to(".arrow-right", {
                    xPercent: 0,
                    duration: duration,
                    ease: "power2.out"
                }, 0)
                .to(".arrow-left", {
                    xPercent: -100,
                    duration: duration,
                    ease: "power2.out"
                }, 0)
    }, { scope: arrowsContainerRef, dependencies: [ hovered ]} )
    return (
        <button
            className={clsx(
                "group select-none text-white uppercase font-semibold rounded-full pointer-events-auto cursor-pointer",
                filled && "bg-[#718674] hover:bg-[#566758] border-2 border-[#566758] transition-colors ease-out duration-300 px-4 sm:px-5 md:px-6 py-2 sm:py-3 md:py-4",
                className
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => startTransition("/contact")}
        >
            <RollingText label={label} hovered={hovered} from={[ "random", "random" ]} duration={duration} stagger={0.125}>
                <div className={"bg-white group-hover:text-[#566758] text-[#718674] text-[0.5rem] sm:text-xs ml-2 p-px sm:p-1 md:p-2 rounded-full overflow-hidden"}>
                    <div className="relative flex overflow-hidden *:inline-block *:stroke-2 *:sm:stroke-3 *:md:stroke-4 *:size-3.5 *:sm:size-2.5 *:md:size-4.5" ref={arrowsContainerRef}>
                        <RightArrow className="arrow-right" />
                        <RightArrow className="absolute inset-0 arrow-left" />
                    </div>
                </div>
            </RollingText>
        </button>
    );
}