import { useTransition } from "@/src/hooks/useTransition";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ThreadItem({ thread }: { thread: any }) {
    const { startTransition } = useTransition();

    const getKarmaColor = (karma: number) => {
        if (karma > 0) return "text-mint-dark";
        if (karma < 0) return "text-red-500";
        return "text-neutral-300";
    };

    return (
        <div 
            onClick={() => startTransition(`/forum/${thread.id}`)}
            className="magnetic group bg-white border border-neutral-100 rounded-2xl p-5 hover:border-neutral-950 transition-colors duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
            <div className="space-y-2 w-full sm:max-w-[75%]">
                <div className="flex flex-wrap gap-2">
                    {thread.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[8px] font-black text-mint-dark uppercase tracking-wider">
                            #{tag}
                        </span>
                    ))}
                </div>
                <h4 className="text-sm font-extrabold text-neutral-950 group-hover:text-mint-dark transition-colors duration-200 uppercase tracking-tight leading-snug truncate">
                    {thread.title}
                </h4>
                <div className="flex items-center gap-2.5 text-[9px] font-bold text-neutral-400 uppercase tracking-wide">
                    <span className="text-neutral-600 truncate max-w-24 sm:max-w-32">{thread.authorName}</span>
                    <span className="w-1 h-1 bg-neutral-200 rounded-full shrink-0" />
                    <span className="shrink-0">{thread.replies || 0} Responses</span>
                </div>
            </div>

            <div className="w-full sm:w-auto sm:pl-5 sm:border-l border-neutral-100 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:pt-0 border-t sm:border-t-0">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                    Reputation
                </span>
                <span className={`text-base font-black tracking-tight transition-colors duration-200 ${getKarmaColor(thread.karma || 0)}`}>
                    {thread.karma ? `${thread.karma > 0 ? "+" : ""}${thread.karma}` : "0"}
                </span>
            </div>
        </div>
    );
}