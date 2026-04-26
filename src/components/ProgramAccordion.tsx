/* eslint-disable @typescript-eslint/no-explicit-any */
export const ProgramAccordion = ({ item, narratives }: { item: any, narratives: any }) => {
    const programNarrative = narratives?.[item.slug];
    
    return (
        <div className="col-span-full bg-white border border-neutral-200 rounded-4xl overflow-hidden shadow-2xl mb-8">
            <div className="p-10 bg-neutral-950 text-white flex justify-between items-center">
                <div>
                    <span className="text-mint-light font-black uppercase tracking-widest text-[10px]">Academic Program</span>
                    <h3 className="text-5xl font-black uppercase tracking-tighter mt-1">{item.name}</h3>
                </div>
                <div className="hidden md:block max-w-xs text-right">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase mb-2">Program Outlook</p>
                    <p className="text-xs text-neutral-300 italic">
                        &quot;{programNarrative?.footnotes || 'Analyzing the academic rigor of this degree...'}&quot;
                    </p>
                </div>
            </div>

            <div className="divide-y divide-neutral-100">
                {Object.entries(item.schools).slice(0, 3).map(([, school]: [string, any]) => {
                    const universitySpecificWhy = programNarrative?.why?.[school.universitySlug];
                    return (
                        <details key={school.universitySlug} className="group outline-none">
                            <summary className="magnetic locked flex items-center justify-between p-8 cursor-pointer hover:bg-neutral-50 transition-colors list-none">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center font-black text-white text-xs uppercase">
                                        {school.acronym}
                                    </div>
                                    <div>
                                        <h5 className="font-black uppercase text-xl tracking-tight text-black">{school.universityName}</h5>
                                        <p className="text-[10px] text-neutral-400 font-bold uppercase">{school.college_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Est. Tuition</p>
                                        <p className="font-bold text-black text-sm">
                                            {school.tuition_range.min === 0 ? "FREE TUITION" : `₱${school.tuition_range.min.toLocaleString()} / sem`}
                                        </p>
                                    </div>
                                    <div className="group-open:rotate-180 transition-transform duration-300">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="black" strokeWidth="2.5"><path d="M5 7.5L10 12.5L15 7.5" /></svg>
                                    </div>
                                </div>
                            </summary>
                            <div className="px-8 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-12 bg-neutral-50/50">
                                <div>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase mb-3 tracking-widest">Available Majors</p>
                                    <div className="flex flex-wrap gap-2">
                                        {school.offered_majors?.map((m: string) => {
                                            const titleCaseMajor = m
                                                .replace(/-/g, ' ')
                                                .split(' ')
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(' ');
                                            return (
                                                <span key={m} className="px-3 py-1 bg-white border border-neutral-200 text-black text-[10px] font-bold rounded-lg shadow-sm">
                                                    {titleCaseMajor}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase mb-2 tracking-widest">Expert Take</p>
                                    <p className="text-xs text-neutral-600 font-medium italic">
                                        {universitySpecificWhy || `Strategically recognized for ${item.name} Excellence.`}
                                    </p>
                                </div>
                            </div>
                        </details>
                    );
                })}
            </div>
        </div>
    );
};