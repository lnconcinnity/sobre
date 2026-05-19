import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useTransition } from "@/src/hooks/useTransition";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SavedUniversityItem({ university }: { university: any }) {
    const { startTransition } = useTransition();

    return (
        <button 
            onClick={() => startTransition(`/search?q=${university.name}`)}
            className="magnetic group relative w-full h-20 rounded-2xl overflow-hidden border border-neutral-200 bg-white cursor-pointer flex items-center transition-colors hover:border-neutral-900 shadow-xs"
        >
            {university.heroImage && (
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={university.heroImage} 
                        alt={university.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                </div>
            )}
            <div className="absolute inset-0 z-10 bg-linear-to-r from-white via-white/80 to-transparent" />
            <div className="relative z-20 w-full px-5 flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-tight text-neutral-950 truncate max-w-[75%]">
                    {university.name}
                </span>
                <div className="p-2 rounded-lg bg-white/40 backdrop-blur-md border border-white/20 text-neutral-600 group-hover:text-neutral-950 transition-colors">
                    <ExternalLink size={14} />
                </div>
            </div>
        </button>
    );
};