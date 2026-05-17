"use client";

import React from "react";

interface FloatingInputProps {
    label: string;
    name: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    children?: React.ReactNode;
}

export default function FloatingInput({ 
    label, 
    name, 
    onChange, 
    value, 
    onKeyDown, 
    onFocus, 
    children 
}: FloatingInputProps) {
    return (
        <div className="locked magnetic relative mt-6 group w-full max-w-md rounded-full">
            <div className="relative overflow-hidden border-b border-black/10 transition-colors duration-500 focus-within:border-mint-dark">
                <input 
                    type="text"
                    name={`sobre_unique_${name}_field`}
                    autoComplete="one-time-code"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    id={name}
                    value={value}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    placeholder=" " 
                    onChange={onChange}
                    className="peer block w-full px-0 pt-4 pb-1 text-base bg-transparent border-none appearance-none focus:outline-none focus:ring-0 transition-colors text-neutral-900"
                />
                <label 
                    htmlFor={name}
                    className="absolute hover:cursor-pointer text-sm tracking-tight text-gray-400 duration-300 transform -translate-y-5 scale-75 top-4 z-10 origin-left 
                               peer-placeholder-shown:scale-100 
                               peer-placeholder-shown:translate-y-0 
                               peer-placeholder-shown:text-base
                               peer-focus:text-xs
                               peer-focus:scale-75 
                               peer-focus:-translate-y-5   
                               peer-focus:tracking-widest
                               peer-focus:text-mint-dark"
                >
                    {label}
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-px bg-mint-dark transition-all duration-700 ease-in-out group-focus-within:w-full" />
            </div>
            { children }
        </div>
    );
}