"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import gsap, { useGSAP } from "@/src/modules/gsap";

export default function ImageDisplay ({ url, onClose }: { url: string | null, onClose: () => void }) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!url) return;
        gsap.fromTo(overlayRef.current, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.fromTo(contentRef.current, 
            { opacity: 0, scale: 0.95, y: 10 }, 
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
        );
    }, { dependencies: [url] });

    if (!url) return null;
    const handleClose = () => {
        gsap.to([overlayRef.current, contentRef.current], {
            opacity: 0,
            y: 10,
            duration: 0.3,
            ease: "power2.in",
            onComplete: onClose
        });
    };

    return createPortal(
        <div ref={overlayRef} className="fixed inset-0 z-100 flex items-center justify-center bg-neutral-950/90 backdrop-blur-sm p-4">
            <button onClick={handleClose} className="magnetic rounded-full absolute top-6 right-6 text-neutral-400 hover:text-white cursor-pointer">
                <X size={32} />
            </button>
            <div ref={contentRef} className="relative size-full max-w-[90vw] max-h-[90vh]">
                <Image src={url} alt="Attachment" className="object-contain rounded-lg shadow-2xl" fill />
            </div>
        </div>,
        document.body
    );
};