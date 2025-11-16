"use client";

import gsap from "@/modules/gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import clsx from "clsx"

const pathHamburgerTop = "M 5 12 L 35 12";
const pathToXTop = "M 8 8 L 32 32";
const pathHamburgerBottom = "M 5 28 L 35 28";
const pathToXBottom = "M 8 32 L 32 8";

export default function HamburgerButton({ toggled, onClick, className }: { toggled: boolean, onClick: () => void, className?: string}) {
    const containerRef = useRef<HTMLButtonElement | null>(null); 
    const lineTopRef = useRef<SVGPathElement | null>(null);
    const lineMiddleRef = useRef<SVGRectElement | null>(null);
    const lineBottomRef = useRef<SVGPathElement | null>(null);
    const tl = useRef<gsap.core.Timeline>(null);;
    useGSAP(() => {
        if (!containerRef.current) return;
        tl.current = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: 0.25 }});
        tl.current
            .to(lineTopRef.current!, { morphSVG: pathToXTop, smoothOrigin: true }, 0)
            .to(lineBottomRef.current!, { morphSVG: pathToXBottom }, 0)
            .to(lineMiddleRef.current!, { opacity: 0, scaleX: 0.1, transformOrigin: 'center center', duration: 0.2 }, 0);
    }, { scope: containerRef })
    useEffect(() => {
        if (!tl.current) return;
        const context = tl.current.timeScale(1);
        if (toggled) context.play();
        else context.reverse();
    }, [toggled]);
    useEffect(() => {
        const btn = containerRef.current;
        if (!btn) return;
        const handleEnter = () => gsap.to(btn, { scale: 1.05, duration: 0.1, ease: "ease.out" });
        const handleLeave = () => gsap.to(btn, { scale: 1, duration: 0.1, ease: "ease.out" });
        const handleDown = () =>  gsap.to(btn, { scale: 0.9, duration: 0.1, ease: "power2.out" });
        const handleUp = () => gsap.to(btn, { scale: 1.05, duration: 0.1, ease: "back.out(2)" });

        btn.addEventListener("pointerenter", handleEnter);
        btn.addEventListener("pointerleave", handleLeave);
        btn.addEventListener("pointerdown", handleDown);
        btn.addEventListener("pointerup", handleUp);

        return () => {
            btn.removeEventListener("pointerenter", handleEnter);
            btn.removeEventListener("pointerleave", handleLeave);
            btn.removeEventListener("pointerdown", handleDown);
            btn.removeEventListener("pointerup", handleUp);
        };
    }, [containerRef])
    const transition = "transition duration-300 ease-in-out";
    return (
        <button
            aria-label="menu"
            className={clsx(className,
                "cursor-pointer pointer-events-auto",
                transition,
                "text-neutral-500 hover:text-black"
            )}
            onClick={onClick}
            ref={containerRef}
        >
            <svg
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
                className="size-full pointer-events-none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            >
                <path
                    ref={lineTopRef}
                    d={pathHamburgerTop}
                    fill="none"
                />
                <rect
                    ref={lineMiddleRef}
                    x="5" y="19" width="30" height="2" rx="2"
                    fill="currentColor"
                    stroke="none"
                />
                <path
                    ref={lineBottomRef}
                    d={pathHamburgerBottom}
                    fill="none"
                />
            </svg>
        </button>
    );
}