"use client";

interface InkStrokeProps {
    className?: string;
}

export default function InkStroke({ className }: InkStrokeProps) {
    return (
        <svg 
            viewBox="0 0 500 525" 
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg" 
            className={`${className || ""} transform-gpu will-change-transform backface-hidden`}
        >
            <defs>
                <linearGradient id="ink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--mint-dark, #41a350)" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#58b765" stopOpacity="1" />
                <stop offset="100%" stopColor="#87df90" stopOpacity="0.9" />
                </linearGradient>
            </defs>
            <g stroke="url(#ink-gradient)">
                {/* WIDE ORIGIN BASE: Heavy grounding layers */}
                <path className="brush-path" d="M150,-60 C150,200 300,350 500,450" strokeWidth="60" strokeOpacity="0.25" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M350,-55 C350,150 400,350 500,480" strokeWidth="55" strokeOpacity="0.25" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M250,-50 C250,250 400,350 500,450" strokeWidth="50" strokeOpacity="0.95" fill="none" strokeLinecap="round" />

                {/* CHAOTIC CORE: Highly structured structural strands */}
                <path className="brush-path" d="M100,-45 C120,250 350,450 500,500" strokeWidth="42" strokeOpacity="0.9" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M400,-35 C400,200 450,220 500,250" strokeWidth="32" strokeOpacity="0.85" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M200,-30 C200,150 350,300 480,400" strokeWidth="28" strokeOpacity="0.9" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M300,-25 C300,250 400,450 500,500" strokeWidth="22" strokeOpacity="0.8" fill="none" strokeLinecap="round" />

                {/* BRISTLE CLUSTER: Thinner lines to simulate organic textures naturally */}
                <path className="brush-path" d="M50,-15 C80,150 350,300 500,380" strokeWidth="14" strokeOpacity="0.75" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M450,-12 C450,150 480,250 500,320" strokeWidth="11" strokeOpacity="0.7" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M220,-10 C220,250 400,350 500,420" strokeWidth="9" strokeOpacity="0.6" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M280,-8 C280,200 400,450 450,500" strokeWidth="7.5" strokeOpacity="0.55" fill="none" strokeLinecap="round" />
                
                {/* STRAY FLYAWAYS: Fine details tracking the composition edges */}
                <path className="brush-path" d="M480,-0 C485,100 490,50 500,100" strokeWidth="5.5" strokeOpacity="0.45" fill="none" strokeLinecap="round" />
                <path className="brush-path" d="M20,-0 C50,250 300,450 500,410" strokeWidth="4.5" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
            </g>
        </svg>
    );
}