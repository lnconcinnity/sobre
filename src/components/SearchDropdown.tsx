"use client";
import { useState, useRef } from "react";
import FloatingSearch from "./FloatingInput"; 
import gsap, { useGSAP } from "../modules/gsap";

interface SearchDropdownProps {
    label?: string;
    name?: string;
    variant?: "default" | "lean";
}

const DropdownItem = ({ icon, label, category }: { icon: string, label: string, category: string }) => (
    <div className="locked magnetic group flex items-center justify-between p-3 hover:bg-mint-light/10 transition-all cursor-pointer rounded-lg">
        <div className="flex items-center gap-3">
            <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">{icon}</span>
            <span className="text-sm font-medium text-neutral-700">{label}</span>
        </div>
        <span className="text-[10px] uppercase tracking-tighter text-neutral-400 font-bold">{category}</span>
    </div>
);

export default function SearchDropdown({ 
    label = "Uncover your path...", 
    name = "query", 
    variant = "default" 
}: SearchDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useGSAP(() => {
        gsap.to(dropdownRef.current, {
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 10 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            duration: 0.4,
            ease: "power3.out"
        });
    }, [isOpen]);

    return (
        <div 
            className={`relative w-full ${variant === 'lean' ? 'max-w-50' : 'max-w-md'}`} 
            onFocusCapture={() => setIsOpen(true)} 
            onBlurCapture={() => setIsOpen(false)}
        >
            {variant === "default" ? (
                <FloatingSearch 
                    label={label} 
                    name={name} 
                    onChange={(e) => console.log(e.target.value)} 
                />
            ) : (
                <div className="magnetic sticky-cursor group relative border-b border-black/10 focus-within:border-mint-dark transition-all">
                    <input 
                        type="text" 
                        name={name}
                        placeholder="Search..." 
                        className="bg-transparent outline-none text-xs py-1 w-full focus:placeholder-transparent transition-all duration-500"
                    />
                </div>
            )}

            <div 
                ref={dropdownRef}
                className={`absolute top-full left-0 mt-2 bg-white/90 backdrop-blur-xl border border-black/5 shadow-2xl rounded-2xl p-2 z-120 overflow-hidden opacity-0 shadow-mint-dark/5 
                    ${variant === 'lean' ? 'w-70 -left-10' : 'w-full'}`}
            >
                <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-400 border-b border-black/5 mb-2 font-bold">
                    Quick Suggestions
                </div>

                <div className="flex flex-col gap-1">
                    <DropdownItem icon="🏫" label="University of the Philippines" category="University" />
                    <DropdownItem icon="🎓" label="De La Salle University" category="University" />
                    <DropdownItem icon="💬" label="Study Abroad Discussion" category="Forum" />
                    
                    <div className="mt-2 pt-2 border-t border-black/5">
                        <div className="flex items-center gap-3 p-3 text-mint-dark italic text-xs cursor-pointer">
                            <span>Search all results for &quot;...&quot;</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}