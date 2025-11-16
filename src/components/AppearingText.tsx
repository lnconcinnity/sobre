"use client";
import gsap, { SplitText, useGSAP } from "@/modules/gsap";
import clsx from "clsx";
import React, { useRef, useMemo, type ReactNode, type RefObject } from "react";

type SplitType = 'chars' | 'words' | 'none';

interface AppearingTextProps {
    children: ReactNode;
    delay?: number;
    split?: SplitType;
    stagger?: number;
    duration?: number;
    className?: string;
    enableScrollTrigger?: boolean;
    as?: React.ElementType;
    vertical?: boolean;
    start?: string;
}

export default function AppearingText({ 
    children, 
    delay: baseDelay = 0, 
    split = 'none', 
    stagger = 0.05, 
    duration = 1, 
    className,
    vertical = false,
    enableScrollTrigger,
    as: Tag = 'div',
    start = "top 85%"
}: AppearingTextProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isStringChild = useMemo(() => typeof children === 'string' || (React.Children.count(children) === 1 && typeof React.Children.only(children) === 'string'), [children]);
    useGSAP(() => {
        if (!containerRef.current) return;
        let targets: gsap.DOMTarget;
        let splitter: SplitText | undefined;
        let initialSetTarget: gsap.DOMTarget;
        try {
            const canSplit = typeof SplitText !== 'undefined' && SplitText !== null; 
            if (isStringChild && canSplit) {
                if (split === "none") {
                    targets = containerRef.current;
                    initialSetTarget = targets;
                } else {
                    splitter = new SplitText(containerRef.current, { type: split });
                    targets = splitter[split];
                    initialSetTarget = targets;
                }
            } else {
                const childElements = containerRef.current.children.length > 0 ? Array.from(containerRef.current.children) : [containerRef.current];
                const hasMultipleDirectChildren = childElements.length > 1;
                const isSingleWrapperWithGrandchildren = childElements.length === 1 && childElements[0].children.length > 0;
                if (hasMultipleDirectChildren) {
                    targets = childElements
                        .map(child => child.children.length === 1 ? child.children[0] : child)
                        .filter(el => el !== undefined);
                }  else if (isSingleWrapperWithGrandchildren) {
                    targets = Array.from(childElements[0].children)
                        .map(grandchild => grandchild.children.length === 1 ? grandchild.children[0] : grandchild)
                        .filter(el => el !== undefined); 
                } else  targets = childElements;
                initialSetTarget = targets;
            }
            gsap.set(initialSetTarget, { y: vertical ? "0%" : '50%', x: vertical ? "50%" : "0%", opacity: 0 }); 
            const animationProps = {
                y: '0%',
                x: '0%',
                opacity: 1,
                duration: duration,
                ease: "power3.out",
                stagger: Array.isArray(targets) && targets.length > 1 ? stagger : 0, 
                delay: baseDelay,
            };
            if (enableScrollTrigger) {
                gsap.to(targets, {
                    ...animationProps,
                    scrollTrigger: {
                        trigger: containerRef.current, 
                        start: start, 
                        once: true,
                    }
                });
            } else gsap.to(targets, animationProps);
        } catch (error) {
            console.error("GSAP/SplitText error in AppearingText:", error);
        }
        return () => {
            if (splitter) splitter.revert();
        };
    }, { scope: containerRef, dependencies: [baseDelay, split, stagger, duration, isStringChild, enableScrollTrigger] });
    return (
        <div className="overflow-hidden inline-block">
            <Tag 
                ref={containerRef as RefObject<HTMLDivElement | null>}
                className={clsx("pointer-events-none", className)}
            >
                {children}
            </Tag>
        </div>
    );
}