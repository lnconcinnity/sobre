import gsap from "@/modules/gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { ReactNode, useMemo, useRef } from "react";

type From = "start" | "end" | "random"
interface RollingTextProps {
    label: string,
    from?: From | From[],
    stagger?: number,
    duration?: number,
    split?: "word" | "char",
    children?: ReactNode,
    className?: string,
    hovered: boolean
}

export default function RollingText({
    label,
    className,
    children,
    hovered,
    duration = 0.5,
    stagger = 0.025,
    split = "word",
    from = "start",
    ...rest
}: RollingTextProps) {
    const textRef = useRef(null);
    const fromArray = Array.isArray(from);
    
    const renderContent = (isTop: boolean) => {
        const cls = isTop ? "rolling-text-top" : "rolling-text-bottom";
        if (split === 'word') {
            const parts = label.split(/(\s+)/).filter(p => p.length > 0);
            return parts.map((part, i) => {
                if (/\s+/.test(part)) {
                    return <span key={`${cls}-space-${i}`}>{part}</span>;
                } else {
                    return (
                        <span key={`${cls}-word-${i}`} className={`${cls} inline-block relative py-0.5`}>
                            {part}
                        </span>
                    );
                }
            });
        }
        
        return label.split("").map((l, i) => (
            <span key={`${cls}-char-${i}`} className={`${cls} inline-block relative`}>
                {l === " " ? "\u00A0" : l}
            </span>
        ));
    };
    const partsCount = useMemo(() => {
        if (split === 'word') return label.split(/(\s+)/).filter(p => p.length > 0 && !/\s+/.test(p)).length;
        return label.split("").length;
    }, [label, split]);
    const { staggerConfig, reverseStaggerConfig } = useMemo(() => {
        const fromVal = fromArray ? from[0] : from;
        const reverseFromVal = fromArray ? from[1] : from;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const staggerConfig: any = { each: stagger, from: fromVal };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reverseStaggerConfig: any = { each: stagger, from: reverseFromVal };

        if (partsCount === 0) return { staggerConfig, reverseStaggerConfig };
        if (fromVal === 'random' || reverseFromVal === 'random') {
            const indices = Array.from({ length: partsCount }, (_, i) => i);
            const shuffledIndices = gsap.utils.shuffle(indices.slice(0)); 
            if (fromVal === 'random') staggerConfig.from = shuffledIndices;
            if (reverseFromVal === 'random') reverseStaggerConfig.from = shuffledIndices;
        }

        return { staggerConfig, reverseStaggerConfig };
    }, [from, fromArray, partsCount, stagger]);

    useGSAP(() => {
        if (!textRef.current) return;
        const topElements = gsap.utils.toArray<HTMLElement>(".rolling-text-top", textRef.current);
        const bottomElements = gsap.utils.toArray<HTMLElement>(".rolling-text-bottom", textRef.current);
        if (hovered)
            gsap.timeline()
                .to(topElements, {
                    yPercent: -100,
                    stagger: staggerConfig,
                    duration: duration,
                    delay: .2,
                    ease: "power2.out"
                }, 0) 
                .to(bottomElements, {
                    yPercent: 0,
                    stagger: staggerConfig,
                    duration: duration,
                    delay: 0.2,
                    ease: "power2.out"
                }, 0);
        else
            gsap.timeline()
                .to(topElements, {
                    yPercent: 0,
                    stagger: reverseStaggerConfig,
                    duration: duration,
                    delay: 0.2,
                    ease: "power2.out"
                }, 0)
                .to(bottomElements, {
                    yPercent: 100,
                    stagger: reverseStaggerConfig,
                    duration: duration,
                    delay: 0.2,
                    ease: "power2.out"
                }, 0);
    }, { scope: textRef, dependencies: [ hovered ] })

    return (
        <div
            className={clsx(
                className,
                "pointer-events-none flex items-center *:inline-block"
            )}
            style={{ lineHeight: 0.75 }}
            ref={textRef}
            {...rest as object}
        >
            <div className="relative overflow-hidden whitespace-nowrap">
                <div>
                    {renderContent(true)}
                </div>
                <div className="absolute inset-0">
                    {renderContent(false)}
                </div>
            </div>
            { children }
        </div>
    )
}