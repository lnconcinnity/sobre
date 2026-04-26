/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef, useState } from "react";
import gsap, { useGSAP } from "../modules/gsap";
import { usePathname } from "next/navigation";

export default function BlobCursor() {
    const pathname = usePathname();
    const isLatched = useRef(false);
    const [hasMoved, setHasMoved] = useState(false);
    const initializedElements = useRef(new Set());

    useGSAP(() => {
        const cursor = document.querySelector("#custom-cursor") as HTMLElement;
        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y };

        gsap.set(cursor, { opacity: 0 });

        const lastMousePos = { x: 0, y: 0 };
        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");

        const tick = () => {
            const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio()); 
            pos.x += (mouse.x - pos.x) * dt;
            pos.y += (mouse.y - pos.y) * dt;
            xSet(pos.x - (cursor.offsetWidth / 2));
            ySet(pos.y - (cursor.offsetHeight / 2));
        };
        gsap.ticker.add(tick);

        const handleMouseMove = (e: MouseEvent) => {
            if (!hasMoved) {
                setHasMoved(true);
                gsap.to(cursor, { opacity: 1, duration: 0.3 });
            }

            lastMousePos.x = e.clientX;
            lastMousePos.y = e.clientY;
            if (!isLatched.current) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }
        };
        const handleScroll = () => {
            if (!isLatched.current) {
                mouse.x = lastMousePos.x;
                mouse.y = lastMousePos.y;
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll, { passive: true });

        const initMagnet = (el: HTMLElement) => {
            if (initializedElements.current.has(el)) return;
            initializedElements.current.add(el);
            const PADDING = 50;
            const isLocked = el.classList.contains('locked') || el.tagName === 'INPUT';
            const rect = el.getBoundingClientRect();
            const area = rect.width * rect.height;
            const strength = Math.max(0.1, Math.min(0.5, 1000 / Math.sqrt(area)));
            let forceOut = false;
            const magnetMove = (e: MouseEvent) => {
                const currentRect = el.getBoundingClientRect();
                const centerX = currentRect.left + currentRect.width / 2;
                const centerY = currentRect.top + currentRect.height / 2;
                const distX = Math.abs(e.clientX - centerX);
                const distY = Math.abs(e.clientY - centerY);
                if (distX > (currentRect.width / 2) + PADDING || distY > (currentRect.height / 2) + PADDING) {
                    if (isLatched.current && !forceOut) {
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
                isLatched.current = true;
                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                if (isLocked) {
                    mouse.x = centerX + (dx * 0.1);
                    mouse.y = centerY + (dy * 0.1);
                    gsap.to(cursor, {
                        width: currentRect.width + 10,
                        height: currentRect.height + 10,
                        duration: 0.5,
                        ease: "power3.out"
                    });
                } else {
                    mouse.x = centerX + dx * strength;
                    mouse.y = centerY + dy * strength;
                    const moveStrength = strength * 0.5;
                    const maxMove = 15;
                    const moveX = Math.max(-maxMove, Math.min(maxMove, dx * moveStrength));
                    const moveY = Math.max(-maxMove, Math.min(maxMove, dy * moveStrength));
                    gsap.to(el, { x: moveX, y: moveY, duration: 0.5, ease: "power2.out" });
                    gsap.to(cursor, {
                        width: currentRect.width + 10,
                        height: currentRect.height + 10,
                        duration: 0.5,
                        overwrite: "auto",
                        ease: "power3.out"
                    });
                }
            };
            const magnetLeave = (isLockedElement: boolean) => {
                isLatched.current = false;
                const exitEase = isLockedElement ? "power4.out" : "elastic.out(1, 0.3)";
                const exitDuration = isLockedElement ? 0.4 : 0.6;
                gsap.killTweensOf(cursor);
                gsap.to(cursor, {
                    width: 24,
                    height: 24,
                    duration: exitDuration,
                    ease: exitEase
                });
                if (!isLockedElement) {
                    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                }
            };
            el.addEventListener("mousemove", magnetMove);
            el.addEventListener("mouseleave", () => {
                if (isLatched.current) magnetLeave(isLocked);
                forceOut = false;
            });
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const magnetics = document.querySelectorAll(".magnetic");
                magnetics.forEach((el) => initMagnet(el as HTMLElement));
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll(".magnetic").forEach((el) => initMagnet(el as HTMLElement));

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", () => {
            if (!isLatched.current) {
                mouse.x = lastMousePos.x;
                mouse.y = lastMousePos.y;
            }
        }, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            observer.disconnect();
            gsap.ticker.remove(tick);
            initializedElements.current.clear();
        };
    }, [pathname]);

    return (
        <div id="custom-cursor" className="fixed top-0 left-0 size-6 border border-mint-dark rounded-full pointer-events-none z-9999" />
    );
}