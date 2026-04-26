/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef } from "react";
import FloatingSearch from "./FloatingInput"; 
import gsap, { useGSAP } from "../modules/gsap";

interface SearchDropdownProps {
    label?: string;
    name?: string;
    variant?: "default" | "lean";
    onSearch?: (query: string) => void;
    suggestions?: any[];
}

const DropdownItem = ({ icon, label, category, onClick }: { icon: string, label: string, category: string, onClick: () => void }) => (
    <button onClick={onClick} className="locked magnetic group flex items-center justify-between p-3 hover:bg-mint-light/10 transition-all cursor-pointer rounded-lg">
        <div className="flex items-center gap-3">
            <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">{icon}</span>
            <span className="text-sm font-medium text-neutral-700">{label}</span>
        </div>
        <span className="text-[10px] uppercase tracking-tighter text-neutral-400 font-bold">{category}</span>
    </button>
);

export default function SearchDropdown({ 
    label = "Uncover your path...", 
    name = "query", 
    variant = "default",
    onSearch, suggestions = []
}: SearchDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [inputValue, setInputValue] = useState("");

    useGSAP(() => {
        gsap.to(dropdownRef.current, {
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 10 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            duration: 0.4,
            ease: "power3.out"
        });
    }, [isOpen]);

    const triggerSearch = (query: string) => {
        if (onSearch) onSearch(query);
        setIsOpen(false);
    };

    return (
        <div 
            className={`relative w-full ${variant === 'lean' ? 'max-w-50' : 'max-w-md'}`} 
            onFocusCapture={() => setIsOpen(true)} 
            onBlurCapture={() => setTimeout(() => setIsOpen(false), 200)}
        >
            {variant === "default" ? (
                <FloatingSearch 
                    label={label} 
                    name={name} 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && triggerSearch(inputValue)}
                />
            ) : (
                <div className="magnetic sticky-cursor group relative border-b border-black/10 focus-within:border-mint-dark transition-all">
                    <input 
                        type="text" 
                        name={name}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && triggerSearch(inputValue)}
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
                    Trending Now
                </div>

                <div className="flex flex-col gap-1">
                    {suggestions.length > 0 ? (
                        suggestions.map((trend) => (
                            <DropdownItem 
                                key={trend.id}
                                icon={trend.query.includes('uni') ? "🏫" : "🎓"} 
                                label={trend.label} 
                                category="Trending" 
                                onClick={() => triggerSearch(trend.query)}
                            />
                        ))
                    ) : (
                        <div className="p-3 text-[10px] text-neutral-400 italic">
                            Start typing to explore...
                        </div>
                    )}
                    {inputValue && (
                        <div className="mt-2 pt-2 border-t border-black/5">
                            <div 
                                onClick={() => triggerSearch(inputValue)}
                                className="flex items-center gap-3 p-3 text-mint-dark italic text-xs cursor-pointer hover:bg-mint-light/5 rounded-lg font-bold"
                            >
                                <span>See all results for &quot;{inputValue}&quot;</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}