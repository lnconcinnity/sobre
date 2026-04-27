"use client";
import { useRef, useState } from "react";
import gsap, { useGSAP } from "../modules/gsap";
import { usePathname } from "next/navigation";

export default function BlobCursor() {
    const pathname = usePathname();
    const cursorRef = useRef<HTMLDivElement>(null);
    const [hasMoved, setHasMoved] = useState(false);
    
    const state = useRef({
        isLatched: false,
        latchedEl: null as HTMLElement | null,
        latchedIsLocked: false,
        mouse: { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 },
        pos: { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 },
        lastMouse: { x: 0, y: 0 }
    });

    useGSAP(() => {
        if (!cursorRef.current) return;
        const cursor = cursorRef.current;
        const s = state.current;

        if (s.latchedEl) {
            gsap.to(s.latchedEl, { x: 0, y: 0, duration: 0.2 });
            s.latchedEl = null;
        }
        s.isLatched = false;
        
        gsap.killTweensOf(cursor);
        gsap.set(cursor, {
            width: 24,
            height: 24,
            borderRadius: "100%",
            xPercent: 0,
            yPercent: 0
        });

        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");

        const tick = () => {
            const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio()); 
            s.pos.x += (s.mouse.x - s.pos.x) * dt;
            s.pos.y += (s.mouse.y - s.pos.y) * dt;
            xSet(s.pos.x - (cursor.offsetWidth / 2));
            ySet(s.pos.y - (cursor.offsetHeight / 2));
        };
        gsap.ticker.add(tick);

        const handleMouseMove = (e: MouseEvent) => {
            if (!hasMoved) {
                setHasMoved(true);
                gsap.to(cursor, { opacity: 1, duration: 0.3 });
            }

            s.lastMouse.x = e.clientX;
            s.lastMouse.y = e.clientY;
            
            if (!s.isLatched) {
                s.mouse.x = e.clientX;
                s.mouse.y = e.clientY;
            }
        };

        const handleScroll = () => {
            if (!s.isLatched) {
                s.mouse.x = s.lastMouse.x;
                s.mouse.y = s.lastMouse.y;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll, { passive: true });

        const initializedElements = new WeakSet();
        const PADDING = 50;

        const initMagnet = (el: HTMLElement) => {
            if (initializedElements.has(el)) return;
            initializedElements.add(el);
            
            const isLocked = el.classList.contains('locked') || el.tagName === 'INPUT';
            let forceOut = false;

            const magnetMove = (e: MouseEvent) => {
                if (!document.contains(el)) {
                    if (s.latchedEl === el) magnetLeave(isLocked);
                    return;
                }

                const currentRect = el.getBoundingClientRect();
                const centerX = currentRect.left + currentRect.width / 2;
                const centerY = currentRect.top + currentRect.height / 2;
                const distX = Math.abs(e.clientX - centerX);
                const distY = Math.abs(e.clientY - centerY);

                if (distX > (currentRect.width / 2) + PADDING || distY > (currentRect.height / 2) + PADDING) {
                    if (s.isLatched && s.latchedEl === el && !forceOut) {
                        magnetLeave(isLocked);
                        forceOut = true;
                    }
                    return;
                }

                if (forceOut) {
                    if (distX < currentRect.width / 2 && distY < currentRect.height / 2) {
                        forceOut = false;
                    } else {
                        return;
                    }
                }

                const elStyles = window.getComputedStyle(el);
                const rawRadius = elStyles.borderRadius;
                const targetRadius = rawRadius.split(' ').map(value => {
                    if (value.includes('%')) return value;
                    
                    const pxValue = parseFloat(value);
                    if (isNaN(pxValue)) return value;
                    return `${pxValue + 5}px`;
                }).join(' ');
                
                s.isLatched = true;
                s.latchedEl = el;
                s.latchedIsLocked = isLocked;
                
                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;

                gsap.to(cursor, {
                    width: currentRect.width + 10,
                    height: currentRect.height + 10,
                    borderRadius: targetRadius,
                    duration: 0.5,
                    overwrite: "auto",
                    ease: "power3.out"
                });
                
                if (isLocked) {
                    s.mouse.x = centerX + (dx * 0.1);
                    s.mouse.y = centerY + (dy * 0.1);
                } else {
                    const area = currentRect.width * currentRect.height;
                    const strength = Math.max(0.1, Math.min(0.5, 1000 / Math.sqrt(area)));
                    s.mouse.x = centerX + dx * strength;
                    s.mouse.y = centerY + dy * strength;
                    
                    const moveStrength = strength * 0.5;
                    const maxMove = 15;
                    const moveX = Math.max(-maxMove, Math.min(maxMove, dx * moveStrength));
                    const moveY = Math.max(-maxMove, Math.min(maxMove, dy * moveStrength));
                    
                    gsap.to(el, { x: moveX, y: moveY, duration: 0.5, ease: "power2.out" });
                }
            };

            const magnetLeave = (isLockedElement: boolean) => {
                if (s.latchedEl === el) {
                    s.isLatched = false;
                    s.latchedEl = null;
                }
                
                const exitEase = isLockedElement ? "power4.out" : "elastic.out(1, 0.3)";
                const exitDuration = isLockedElement ? 0.4 : 0.6;
                
                gsap.killTweensOf(cursor);
                gsap.to(cursor, {
                    width: 24,
                    height: 24,
                    borderRadius: "100%",
                    duration: exitDuration,
                    ease: exitEase
                });
                
                if (!isLockedElement) {
                    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                }
            };

            const handleOnLeave = () => {
                if (s.isLatched && s.latchedEl === el) magnetLeave(isLocked);
                forceOut = false;
            };

            el.addEventListener("mousemove", magnetMove);
            el.addEventListener("mouseleave", handleOnLeave);
        };

        const observer = new MutationObserver(() => {
            document.querySelectorAll(".magnetic").forEach((el) => initMagnet(el as HTMLElement));
        });

        observer.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll(".magnetic").forEach((el) => initMagnet(el as HTMLElement));

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
            gsap.ticker.remove(tick);
            
            if (s.latchedEl) {
                gsap.to(s.latchedEl, { x: 0, y: 0, duration: 0.2 });
                s.latchedEl = null;
            }
            s.isLatched = false;
            
            gsap.killTweensOf(cursor);
            gsap.set(cursor, { width: 24, height: 24 });
        };
    }, [pathname]);

    return (
        <div ref={cursorRef} id="custom-cursor" className={`fixed top-0 left-0 size-6 border border-mint-dark pointer-events-none z-9999 ${hasMoved ? 'opacity-100' : 'opacity-0'}`} />
    );
}