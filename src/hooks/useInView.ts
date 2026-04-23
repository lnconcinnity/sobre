/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, RefObject } from "react";

interface UseInViewOptions extends IntersectionObserverInit {
    once?: boolean;
}

export function useInView(
    options: UseInViewOptions = {}
): [RefObject<any>, boolean] {
    const { threshold = 0.1, root = null, rootMargin = "0px", once = false } = options;
    
    const [isInView, setIsInView] = useState(false);
    const elementRef = useRef<any>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                const isIntersecting = entry.isIntersecting;
                setIsInView(isIntersecting);
                if (isIntersecting && once) observer.unobserve(element);
            },
            { threshold, root, rootMargin }
        );
        observer.observe(element);

        return () => {
         if (element) observer.unobserve(element);
        };
    }, [threshold, root, rootMargin, once]);

    return [elementRef as RefObject<any>, isInView];
}