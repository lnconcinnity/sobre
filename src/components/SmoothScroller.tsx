"use client";

import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "../modules/gsap";
import { useRef, useState } from "react";
import { SmoothContext } from "../hooks/useSmoother";
import { useTransition } from "../hooks/useTransition";

export default function SmoothScroller({ smooth = 1.5, children }: { smooth?: number; children: React.ReactNode }) {
    const wrapper = useRef(null);
    const content = useRef(null);
    const [smoother, setSmoother] = useState<ScrollSmoother | null>(null);
    const { _setSmootherInstance } = useTransition();

    useGSAP(() => {
        _setSmootherInstance(smoother);
    }, [smoother, _setSmootherInstance]);

    useGSAP(() => {
        const smoother = ScrollSmoother.create({
            wrapper: wrapper.current,
            content: content.current,
            smooth: smooth,
            effects: true,
            normalizeScroll: true,
        });
        setSmoother(smoother);
        smoother.scrollTop();
        return () => {
            smoother.kill()
        };
    }, { scope: wrapper });

    return (
        <SmoothContext.Provider value={smoother}>
            <div ref={wrapper} id="smooth-wrapper">
                <div ref={content} id="smooth-content">
                    {children}
                </div>
            </div>
        </SmoothContext.Provider>
    );
}