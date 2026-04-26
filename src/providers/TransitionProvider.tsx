/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TransitionContext } from "../hooks/useTransition";
import gsap, { SplitText, useGSAP } from "../modules/gsap";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo, useRef, useState, useCallback } from "react";

const FADE_OUT_OFFSET = 0.35;
const TEXT_DURATION = 0.5;
const TEXT_FADE_DURATION = 0.3;
const TEXT_PAUSE = 0.2;
const WIPE_OVERLAP = -0.2;
const WIPE_INTERNAL_DELAY = 0.1;

export default function TransitionProvider({ children, duration = 1, delay = 0.1, splashText = "Sobre" }: { children: ReactNode, duration?: number, delay?: number, splashText?: string }) {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const splashOutlineRef = useRef<HTMLSpanElement | null>(null);
    const splashFillRef = useRef<HTMLSpanElement | null>(null);
    const [introCompleted, setIntroCompleted] = useState(false);
    const smootherRef = useRef<any | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const isIndexPage = pathname === "/";
    
    const baseIntroTime = useMemo(() => {
        const textEnd = FADE_OUT_OFFSET + TEXT_DURATION + TEXT_PAUSE + TEXT_FADE_DURATION;
        return textEnd + WIPE_OVERLAP + WIPE_INTERNAL_DELAY;
    }, []);
    
    const totalDuration = useMemo(() => (delay / 2 + baseIntroTime + duration / 2), [duration, delay, baseIntroTime]);

    const playExitAnimation = useCallback(() => {
        if (!overlayRef.current) return;
        gsap.killTweensOf(overlayRef.current);
        gsap.set(overlayRef.current, { pointerEvents: 'auto' });
        
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(overlayRef.current, { pointerEvents: 'none' });
            }
        });

        if (isIndexPage && !introCompleted) {
            let splitterFill: SplitText | undefined;
            let splitterOutline: SplitText | undefined;
            
            const TEXT_APPEAR_END_TIME = delay + FADE_OUT_OFFSET + TEXT_DURATION;
            const TEXT_FADE_START_TIME = TEXT_APPEAR_END_TIME + TEXT_PAUSE;
            const WIPE_START_TIME = TEXT_FADE_START_TIME + TEXT_FADE_DURATION + WIPE_OVERLAP;

            if (splashFillRef.current && splashOutlineRef.current) {
                gsap.set([splashFillRef.current, splashOutlineRef.current], { visibility: "visible" });
                splitterFill = new SplitText(splashFillRef.current, { type: "chars" });
                splitterOutline = new SplitText(splashOutlineRef.current, { type: "chars" });
                const allChars = [...splitterFill.chars, ...splitterOutline.chars];
                
                document.body.style.overflow = "hidden";
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
                        splitterFill?.revert();
                        splitterOutline?.revert();
                        document.body.style.overflow = "auto";
                        setIntroCompleted(true);
                    }
                }, WIPE_START_TIME);
            } else {
                tl.to(overlayRef.current, { xPercent: 100, duration, ease: "power3.inOut", delay });
            }
        } else {
            tl.to(overlayRef.current, { xPercent: 100, duration, ease: "power3.inOut", delay });
        }
    }, [isIndexPage, duration, delay, introCompleted]);

    useGSAP(() => {
        if (smootherRef.current) smootherRef.current.scrollTo(0, false);
        playExitAnimation();
    }, [pathname, playExitAnimation]);

    const getSmootherInstance = (instance: any) => smootherRef.current = instance;

    const startTransition = (href: string) => {
        if (!overlayRef.current) {
            router.push(href);
            return;
        }

        const isSamePage = pathname === href.split('?')[0];
        
        gsap.set(overlayRef.current, { pointerEvents: 'auto', xPercent: -100 });
        document.body.style.overflow = "hidden";

        gsap.to(overlayRef.current, {
            xPercent: 0,
            duration: duration,
            ease: "power3.inOut",
            onComplete: () => {
                router.push(href);
                if (isSamePage) {
                    playExitAnimation();
                }
                document.body.style.overflow = "auto";
            }
        });
    };

    return (
        <TransitionContext.Provider value={{ startTransition, totalDuration, _setSmootherInstance: getSmootherInstance }}>
            <div 
                ref={overlayRef} 
                className="fixed inset-0 size-full bg-[#263127] z-99999 grid place-items-center"
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