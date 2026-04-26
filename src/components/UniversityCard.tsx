/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";

export const UniversityCard = ({ item, narrative }: { item: any, narrative: any }) => {
    return (
        <div className="locked magnetic glass-panel group relative h-[75vh] overflow-hidden rounded-4xl bg-neutral-900 border border-white/10 shadow-sm transition-all duration-500 hover:shadow-2xl">
            <div className="absolute inset-0 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out">
                <div className="absolute inset-0 bg-neutral-800" />
                {item.heroImage && (
                    <Image src={item.heroImage} alt={item.name} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-900/20 to-transparent opacity-90" />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-8 z-10 translate-y-0 group-hover:-translate-y-36 transition-transform duration-500 ease-out">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-mint-dark/20 border border-mint-dark/30 rounded text-[9px] font-black text-mint-light uppercase tracking-widest">
                        {narrative?.projected_tf}
                    </span>
                </div>
                <h4 className="text-4xl font-black text-white uppercase leading-[0.85] tracking-tighter">
                    {item.name.split(' ').map((word: string, j: number) => <span key={j} className="block">{word}</span>)}
                </h4>
                <p className="text-[10px] text-neutral-400 mt-4 uppercase tracking-widest font-bold">
                    {item.location.city} • {item.location.campus}
                </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-neutral-950/95 backdrop-blur-2xl border-t border-white/10 h-48 flex flex-col justify-between">
                <div>
                    <p className="text-[10px] font-bold text-mint-light uppercase mb-2 tracking-widest">Match Analysis</p>
                    <p className="text-xs text-neutral-300 leading-relaxed font-medium line-clamp-3">{narrative?.why}</p>
                </div>
                <div className="flex flex-col pt-4 border-t border-white/5">
                    <span className="text-[9px] text-neutral-500 uppercase font-black">Commute Vibe</span>
                    <span className="text-[10px] text-neutral-300 font-medium">{narrative?.footnotes}</span>
                </div>
            </div>
        </div>
    );
};