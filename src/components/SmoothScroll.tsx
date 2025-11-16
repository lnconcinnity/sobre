"use client";

import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "@/modules/gsap";
import { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
    useGSAP(() => {
        const smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.5,
            smoothTouch: 1.2,
            effects: true,
            normalizeScroll: true,
        });

        return () => smoother.kill();
    }, []);
    return (
        <div id="smooth-wrapper" className="overflow-hidden">
            <div id="smooth-content" className="z-0">
                { children }
            </div>
        </div>
    );
}