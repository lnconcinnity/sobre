/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import FloatingSearch from "./FloatingInput"; 
import gsap, { useGSAP } from "../modules/gsap";

interface SearchDropdownProps {
    label?: string;
    name?: string;
    variant?: "default" | "lean";
    onSearch?: (query: string) => void;
    suggestions?: any[];
}

const DropdownItem = ({ 
    icon, 
    label, 
    category, 
    onClick,
    isFocused 
}: { 
    icon: string, 
    label: string, 
    category: string, 
    onClick: () => void,
    isFocused: boolean 
}) => (
    <button 
        onClick={onClick} 
        tabIndex={-1}
        className={`w-full text-left locked relative group flex items-center justify-between p-3 transition-colors cursor-pointer rounded-lg outline-none ${
            isFocused ? "bg-mint-dark text-white!" : "hover:bg-mint-light/10"
        }`}
    >
        <div className="flex items-center gap-3 w-[75%]">
            <span className={`text-lg transition-opacity shrink-0 ${isFocused ? "opacity-100" : "opacity-50 group-hover:opacity-100"}`}>
                {icon}
            </span>
            <span className={`text-xs font-medium truncate ${isFocused ? "text-white" : "text-neutral-700"}`}>
                {label}
            </span>
        </div>
        <span className={`text-[9px] uppercase tracking-tighter font-black shrink-0 px-2 py-0.5 rounded ${
            isFocused ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
        }`}>
            {category}
        </span>
    </button>
);

export default function SearchDropdown({ 
    label = "Uncover your path...", 
    name = "query", 
    variant = "default",
    onSearch, 
    suggestions: trendingSuggestions = []
}: SearchDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [relevantSuggestions, setRelevantSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const hasInput = inputValue.trim().length >= 2;
    const activeSuggestions = hasInput ? relevantSuggestions : trendingSuggestions;

    const internalTotalCount = useMemo(() => {
        const standardCount = activeSuggestions.length;
        return hasInput ? standardCount + 1 : standardCount;
    }, [activeSuggestions, hasInput]);

    useEffect(() => {
        if (!hasInput) {
            setRelevantSuggestions([]);
            return;
        }

        const fetchSemanticSuggestions = async () => {
            setIsLoading(true);
            try {
                const targetUrl = `/api/analytics/find?q=${encodeURIComponent(inputValue.trim())}`;
                const res = await fetch(targetUrl);
                if (res.ok) {
                    const data = await res.json();
                    setRelevantSuggestions(data.results || []);
                }
            } catch (err) {
                console.error("Failed fetching instant vector suggestions:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const delayDebounce = setTimeout(fetchSemanticSuggestions, 400);
        return () => clearTimeout(delayDebounce);
    }, [inputValue, hasInput]);

    useGSAP(() => {
        gsap.to(dropdownRef.current, {
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 10 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            duration: 0.3,
            ease: "power2.out"
        });
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const triggerSearch = (query: string) => {
        if (!query.trim()) return;
        setInputValue(query);
        if (onSearch) onSearch(query);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setFocusedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === "ArrowDown") setIsOpen(true);
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1 >= internalTotalCount ? 0 : prev + 1));
                break;

            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((prev) => (prev - 1 < 0 ? internalTotalCount - 1 : prev - 1));
                break;

            case "Enter":
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < activeSuggestions.length) {
                    triggerSearch(activeSuggestions[focusedIndex].query);
                } else {
                    triggerSearch(inputValue);
                }
                break;

            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setFocusedIndex(-1);
                break;
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md z-50">
            {variant === "default" ? (
                <FloatingSearch 
                    label={label} 
                    name={name} 
                    value={inputValue}
                    onFocus={() => setIsOpen(true)}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <div className="sm:magnetic sticky-cursor group relative border-b border-black/10 focus-within:border-mint-dark transition-colors">
                    <input 
                        type="text" 
                        name={`sobre_unique_${name}_field`}
                        autoComplete="one-time-code"
                        value={inputValue}
                        onFocus={() => setIsOpen(true)}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search..." 
                        className="bg-transparent outline-none text-xs py-1 w-full focus:placeholder-transparent transition-colors duration-500 text-neutral-900"
                    />
                </div>
            )}

            <div 
                ref={dropdownRef}
                className={`absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl border border-neutral-200/80 shadow-2xl rounded-2xl p-2 z-120 overflow-hidden opacity-0 shadow-neutral-950/5
                    ${variant === 'lean' ? 'w-70 -left-10' : 'w-full'}`}
                style={{ willChange: "transform, opacity" }}
            >
                <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-400 border-b border-black/5 mb-2 font-black flex justify-between items-center select-none">
                    <span>{hasInput ? "Relevant Discoveries" : "Trending Now"}</span>
                    {isLoading && <span className="text-[9px] lowercase text-mint-dark animate-pulse">Running Semantic Search...</span>}
                </div>

                { variant !== "lean" && ( 
                    <div className="flex flex-col gap-1">
                        {activeSuggestions.length > 0 ? (
                            activeSuggestions.map((suggestion, idx) => (
                                <DropdownItem 
                                    key={suggestion.id || idx}
                                    icon={suggestion.icon || "🎓"} 
                                    label={suggestion.label} 
                                    category={suggestion.category || "Trending"} 
                                    isFocused={focusedIndex === idx}
                                    onClick={() => triggerSearch(suggestion.query)}
                                />
                            ))
                        ) : (
                            <div className="p-3 text-[10px] text-neutral-400 italic select-none">
                                {isLoading ? "Querying vector space..." : "No close matches found..."}
                            </div>
                        )}

                        {hasInput && (
                            <div className="mt-1 pt-1 border-t border-neutral-100">
                                <div 
                                    onClick={() => triggerSearch(inputValue)}
                                    className={`flex items-center justify-between p-3 text-xs cursor-pointer rounded-lg font-bold transition-colors ${
                                        focusedIndex === activeSuggestions.length 
                                            ? "bg-mint-dark text-white!" 
                                            : "text-mint-dark hover:bg-mint-light/5 italic"
                                    }`}
                                >
                                    <span>See deep metrics for &quot;{inputValue}&quot;</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}