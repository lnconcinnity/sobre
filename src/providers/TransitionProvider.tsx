"use client";
import { TransitionContext } from "@/hooks/useTransition";
import gsap, { SplitText, useGSAP } from "@/modules/gsap";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo, useRef, useState } from "react";

const FADE_OUT_OFFSET = 0.35;
const TEXT_DURATION = 0.5
const TEXT_FADE_DURATION = 0.3;
const TEXT_PAUSE = 0.2;
const WIPE_OVERLAP = -0.2;
const WIPE_INTERNAL_DELAY = 0.1;

export default function TransitionProvider({ children, duration = 1, delay = 0.1, splashText = "Sobre" }: { children: ReactNode, duration?: number, delay?: number, splashText?: string }) {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const splashOutlineRef = useRef<HTMLSpanElement | null>(null);
    const splashFillRef = useRef<HTMLSpanElement | null>(null);
    const [introCompleted, setIntroCompleted] = useState(false);
    
    const router = useRouter();
    const pathname = usePathname();
    const isIndexPage = pathname === "/";
    const baseIntroTime = useMemo(() => {
        const textEnd = FADE_OUT_OFFSET + TEXT_DURATION + TEXT_PAUSE + TEXT_FADE_DURATION;
        const totalTimeBeforeWipeEnd = textEnd + WIPE_OVERLAP + WIPE_INTERNAL_DELAY;
        return totalTimeBeforeWipeEnd;
    }, []);
    const totalDuration = useMemo(() => (delay/2 + baseIntroTime + duration/2), [duration, delay, baseIntroTime]);
    useGSAP(() => {
        let splitterFill: SplitText | undefined;
        let splitterOutline: SplitText | undefined;
        
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(overlayRef.current, { pointerEvents: 'none' });
            }
        });

        if (isIndexPage) {
            const TEXT_APPEAR_END_TIME = delay + FADE_OUT_OFFSET + TEXT_DURATION;
            const TEXT_FADE_START_TIME = TEXT_APPEAR_END_TIME + TEXT_PAUSE;
            const WIPE_START_TIME = TEXT_FADE_START_TIME + TEXT_FADE_DURATION + WIPE_OVERLAP;
            if (splashFillRef.current && splashOutlineRef.current) {
                gsap.set([splashFillRef.current, splashOutlineRef.current], { visibility: "visible" });
                splitterFill = new SplitText(splashFillRef.current, { type: "chars" });
                splitterOutline = new SplitText(splashOutlineRef.current, { type: "chars" });
                const allChars = [...splitterFill.chars, ...splitterOutline.chars];
                document.body.style.overflow = "hidden"
                gsap.set(allChars, { opacity: 0 });
                tl.fromTo(splitterOutline.chars, 
                    { yPercent: -50, opacity: 0 }, 
                    {
                        visibility: "visible",
                        yPercent: 0,
                        opacity: 1,
                        duration: TEXT_DURATION,
                        ease: "power3.out",
                        stagger: { each: 0.05, from: "start" },
                    }, delay)
                .fromTo(splitterFill.chars, 
                    { opacity: 0 }, 
                    {
                        opacity: 1,
                        duration: TEXT_DURATION,
                        ease: "power3.out",
                        stagger: { each: 0.05, from: "start" },
                    }, delay + FADE_OUT_OFFSET)
                .to(allChars, {
                    opacity: 0,
                    duration: TEXT_FADE_DURATION,
                    stagger: { each: 0.01, from: "start" },
                }, TEXT_FADE_START_TIME)
                    .to(overlayRef.current, {
                    xPercent: 100,
                    duration: duration,
                    ease: "power3.in",
                    delay: WIPE_INTERNAL_DELAY,
                    onComplete: () => {
                        if (splitterFill) splitterFill.revert();
                        if (splitterOutline) splitterOutline.revert();
                        document.body.style.overflow = "auto";
                        setIntroCompleted(true);
                    }
                }, WIPE_START_TIME)
            } else standardExitAnimation(tl, duration, delay);
        } else standardExitAnimation(tl, duration, delay);

        function standardExitAnimation(timeline: gsap.core.Timeline, duration: number, delay: number) {
            timeline.to(overlayRef.current, {
                xPercent: 100,
                duration: duration,
                ease: "power3.inOut",
                delay: delay,
            });
        }
        
        return () => {
            if (splitterFill) splitterFill.revert();
            if (splitterOutline) splitterOutline.revert();
        }
    }, [pathname, isIndexPage, duration]);

    const startTransition = (href: string) => {
        if (!overlayRef.current) {
            router.push(href);
            return;
        }
        gsap.set(overlayRef.current, { pointerEvents: 'auto', xPercent: -100 });
        document.body.style.overflow = "hidden"
        gsap.to(overlayRef.current, {
            xPercent: 0,
            duration: duration,
            ease: "power3.inOut",
            onComplete: () => {
                router.push(href);
                document.body.style.overflow = "auto"
            }
        });
    };

    return (
        <TransitionContext.Provider value={{ startTransition, totalDuration }}>
            <div 
                ref={overlayRef} 
                className="fixed inset-0 size-full bg-[#263127] z-9999 grid place-items-center"
            >
                { (isIndexPage && !introCompleted) && (
                    <div className="overflow-hidden">
                        <div className="relative">
                            <span 
                                ref={splashOutlineRef} 
                                className="text-5xl tracking-wide font-black absolute inset-0 text-transparent"
                                style={{ WebkitTextStroke: "0.4px #F7F7F7", visibility: "hidden" }}
                            > 
                                { splashText } 
                            </span> 
                            <span 
                                ref={splashFillRef} 
                                className="text-5xl text-white tracking-wide font-black relative" 
                                style={{ visibility: "hidden" }}
                            > 
                                { splashText } 
                            </span> 
                        </div>
                    </div>
                )}
            </div>
            { children }
        </TransitionContext.Provider>
    )
}