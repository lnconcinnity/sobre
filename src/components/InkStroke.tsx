"use client";
import { useId } from "react";

export default function InkStroke({ className }: { className?: string }) {
    const filterId = useId().replace(/:/g, "");
    return (
    <svg 
        viewBox="0 0 500 525" 
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
    >
        <defs>
            <filter id={filterId}>
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" />
            </filter>
        </defs>

        <g filter={`url(#${filterId})`}>
            {/* WIDE ORIGIN BASE: Smoother transition to the exit */}
            <path className="brush-path" d="M150,-60 C150,200 300,350 500,450" strokeWidth="60" strokeOpacity="0.3" fill="none" strokeLinecap="round" />
            <path className="brush-path" d="M350,-55 C350,150 400,350 500,480" strokeWidth="55" strokeOpacity="0.3" fill="none" strokeLinecap="round" />
            <path className="brush-path" d="M250,-50 C250,250 400,350 500,450" strokeWidth="50" fill="none" strokeLinecap="round" />

            {/* CHAOTIC CORE: Scattered starts, but disciplined exits */}
            <path className="brush-path" d="M100,-45 C120,250 350,450 500,500" strokeWidth="45" fill="none" strokeLinecap="round" />
            <path className="brush-path" d="M400,-35 C400,200 450,220 500,250" strokeWidth="35" fill="none" strokeLinecap="round" />
            <path className="brush-path" d="M200,-30 C200,150 350,300 480,400" strokeWidth="30" fill="none" strokeLinecap="round" />
            <path className="brush-path" d="M300,-25 C300,250 400,450 500,500" strokeWidth="25" fill="none" strokeLinecap="round" />

            {/* BRISTLE CLUSTER: High density, zero U-turns */}
            <path className="brush-path" d="M50,-15 C80,150 350,300 500,380" strokeWidth="15" fill="none" strokeLinecap="round" />
            <path className="brush-path" d="M450,-12 C450,150 480,250 500,320" strokeWidth="12" fill="none" strokeLinecap="round" />
            <path className="brush-path" d="M220,-10 C220,250 400,350 500,420" strokeWidth="10" fill="none" strokeLinecap="round" strokeOpacity="0.7" />
            <path className="brush-path" d="M280,-8 C280,200 400,450 450,500" strokeWidth="8" fill="none" strokeLinecap="round" strokeOpacity="0.6" />
            
            {/* STRAY FLYAWAYS: Subtle flicks toward the right edge */}
            <path className="brush-path" d="M480,-0 C485,100 490,50 500,100" strokeWidth="6" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
            <path className="brush-path" d="M20,-0 C50,250 300,450 500,410" strokeWidth="5" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
        </g>
    </svg>
  );
}