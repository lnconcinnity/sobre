/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

export default function VoteSideview ({ karma, handleVote, userVote }: any) {
    return (
        <div className="flex flex-col items-center gap-1 shrink-0 select-none">
            <button 
                onClick={() => handleVote(1)} 
                className={`${userVote === 1 ? 'text-mint-dark' : 'text-neutral-400'} rounded-full cursor-pointer magnetic hover:text-mint-dark transition-colors p-0.5`}
            >
                <ChevronUp size={16} fill={userVote === 1 ? "currentColor" : "transparent"} />
            </button>
            <span className="text-[10px] font-black text-neutral-600 tracking-tighter min-w-3 text-center">{karma || 0}</span>
            <button 
                onClick={() => handleVote(-1)} 
                className={`${userVote === -1 ? 'text-red-500' : 'text-neutral-400'} rounded-full cursor-pointer magnetic hover:text-red-500 transition-colors p-0.5`}
            >
                <ChevronDown size={16} fill={userVote === -1 ? "currentColor" : "transparent"} />
            </button>
        </div>
    );
}