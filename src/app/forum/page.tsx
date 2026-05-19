"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { 
    MessageSquare, 
    Lock, 
    Loader2, 
    Flame, 
    Clock, 
    Compass, 
    ArrowUpRight, 
    Layers, 
    Sparkles, 
    User,
    ArrowUp,
    Sparkle,
    ArrowLeftRight,
    ArrowDownRight,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useTransition } from "@/src/hooks/useTransition";
import Image from "next/image";
import { usePosts } from "@/src/hooks/usePosts";
import gsap from "@/src/modules/gsap";

export default function ForumPage() {
    const { user } = useAuth();
    const { startTransition } = useTransition();
    const [activeTab, setActiveTab] = useState("latest");
    const { posts, loading: postsLoading } = usePosts();
    const [time, setTime] = useState(() => Date.now());
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        if (!indicatorRef.current) return;
        
        const maxScroll = target.scrollWidth - target.clientWidth;
        if (maxScroll <= 0) return;
        const scrollPercentage = target.scrollLeft / maxScroll;
        const dynamicValue = Math.round((1 - scrollPercentage) * 100);
        indicatorRef.current.style.setProperty("--indicator-tx", `${dynamicValue}%`);
    };

    useEffect(() => {
        const timer = setInterval(() => setTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const sidebarNode = sidebarRef.current;
        const gridNode = gridRef.current;

        if (!gridNode || !sidebarNode) return;

        const handlePageScroll = () => {
            if (window.innerWidth < 1024) {
                gsap.killTweensOf(sidebarNode);
                gsap.set(sidebarNode, { clearProps: "all" });
                return;
            }

            const gridTopFromDoc = gridNode.offsetTop;
            const gridHeight = gridNode.offsetHeight;
            const sidebarHeight = sidebarNode.offsetHeight;
            const currentScroll = window.scrollY;
            
            const targetTopOffset = 144; 
            const desiredTop = currentScroll - gridTopFromDoc + targetTopOffset;
            const maxTop = gridHeight - sidebarHeight;
            const clampedTop = Math.max(0, Math.min(desiredTop, maxTop));
            
            gsap.to(sidebarNode, {
                top: clampedTop,
                duration: 1,
                ease: "sine.out",
                overwrite: "auto"
            });
        };

        window.addEventListener("scroll", handlePageScroll);
        window.addEventListener("resize", handlePageScroll);
        
        const resizeObserver = new ResizeObserver(() => handlePageScroll());
        resizeObserver.observe(gridNode);
        handlePageScroll();

        return () => {
            window.removeEventListener("scroll", handlePageScroll);
            window.removeEventListener("resize", handlePageScroll);
            resizeObserver.disconnect();
            gsap.killTweensOf(sidebarNode);
        };
    }, [posts, activeTab]);

    const sortedPosts = useMemo(() => {
        if (!posts) return [];
        const filtered = [...posts];
        const nowInSeconds = Math.floor(time / 1000);

        switch (activeTab) {
            case "hot":
                return filtered.sort((a, b) => {
                    const aSeconds = a.createdAt?.seconds || nowInSeconds;
                    const bSeconds = b.createdAt?.seconds || nowInSeconds;
                    const aAgeHours = Math.max(0, (nowInSeconds - aSeconds) / 3600);
                    const bAgeHours = Math.max(0, (nowInSeconds - bSeconds) / 3600);
                    const aEngagements = (a.karma || 0) + (a.globalClicks || 0) * 0.5;
                    const bEngagements = (b.karma || 0) + (b.globalClicks || 0) * 0.5;
                    const gravity = 1.5;
                    const aHotScore = aEngagements / Math.pow(aAgeHours + 2, gravity);
                    const bHotScore = bEngagements / Math.pow(bAgeHours + 2, gravity);
                    return bHotScore - aHotScore;
                });

            case "best":
                return filtered.sort((a, b) => {
                    if (b.karma !== a.karma) return (b.karma || 0) - (a.karma || 0);
                    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
                });

            case "unsolved":
                return filtered
                    .filter(post => (post.replies || 0) === 0)
                    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

            case "latest":
            default:
                return filtered.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        }
    }, [posts, activeTab, time]);

    return (
        <div className="relative min-h-screen bg-[#fbfdfb] pt-28 md:pt-36 pb-24 px-4 sm:px-8 md:px-16 overflow-hidden flex flex-col justify-between">
            <div 
                className="absolute inset-0 z-0 bg-architectural-grid bg-size-[4rem_4rem] opacity-40 pointer-events-none" 
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    willChange: "transform",
                    transform: "translateZ(0)"
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto w-full grow flex flex-col justify-center">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 md:mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black text-mint-dark uppercase tracking-[0.3em] block">
                                The Collective Intelligence
                            </span>
                            <Sparkles size={12} className="text-mint-dark animate-pulse" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-neutral-900 uppercase leading-[0.95] tracking-tighter">
                            Student <br className="sm:hidden" />
                            <span className="text-transparent italic font-serif font-light tracking-wide pl-1" style={{ WebkitTextStroke: "1px #263127" }}>
                                Forum.
                            </span>
                        </h1>
                    </div>
                    <div className="relative flex items-center bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-full sm:w-auto overflow-hidden">
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            data-speed="1"
                            data-lag="0"
                            className="flex p-1.5 overflow-x-auto no-scrollbar max-w-full sm:w-auto self-start lg:self-end"
                            style={{ touchAction: "pan-x" }} 
                        >
                            {[
                                { id: "latest", label: "Latest", icon: Clock },
                                { id: "hot", label: "Hot", icon: Flame },
                                { id: "best", label: "Best", icon: Sparkle },
                                { id: "unsolved", label: "Unsolved", icon: Compass }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`magnetic flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-200 cursor-pointer ${
                                            activeTab === tab.id 
                                                ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10" 
                                                : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50"
                                        }`}
                                    >
                                        <Icon size={12} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div 
                            ref={indicatorRef}
                            className="sm:hidden absolute right-3 pointer-events-none p-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700 flex items-center justify-center transition-transform shadow-xs"
                            style={{
                                transform: "translateX(var(--indicator-tx, 100%))",
                                willChange: "transform"
                            }}
                        >
                            <ArrowLeftRight size={10} className="animate-pulse" />
                        </div>
                    </div>
                </div>
                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative w-full min-w-0">
                    <div className="lg:col-span-8 space-y-4 order-2 lg:order-1 w-full min-w-0">
                        {postsLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-white border border-neutral-100 rounded-4xl text-neutral-300 shadow-sm">
                                <Loader2 className="animate-spin mb-4 text-mint-dark" size={36} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Querying the collective matrix...</span>
                            </div>
                        ) : sortedPosts.length === 0 ? (
                            <div className="py-24 px-6 text-center border-2 border-dashed border-neutral-200 rounded-4xl bg-white/50 backdrop-blur-sm">
                                <Layers size={32} className="mx-auto text-neutral-300 mb-4" />
                                <p className="text-neutral-400 text-sm font-medium italic">The archives are clean. Be the first to start a conversation track.</p>
                            </div>
                        ) : (
                            sortedPosts.map((post) => {
                                const getKarmaSpecs = (karma: number) => {
                                    if (!karma || karma === 0) return { Icon: ArrowLeftRight, colorClass: "group-hover:text-neutral-900" };
                                    if (karma < 0) return { Icon: ArrowDownRight, colorClass: "group-hover:text-red-500" };
                                    return { Icon: ArrowUpRight, colorClass: "group-hover:text-mint-dark" };
                                };

                                const { Icon: KarmaIcon, colorClass: karmaColor } = getKarmaSpecs(post.karma);
                                
                                return (
                                    <div 
                                        key={post.id}
                                        onClick={() => startTransition(`/forum/${post.id}`)}
                                        className="magnetic group p-6 md:p-8 bg-white border border-neutral-200/80 rounded-4xl hover:border-neutral-900 hover:shadow-xl hover:shadow-neutral-100/60 transition-colors duration-300 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full min-w-0 layout-card"
                                    >
                                        <div className="space-y-4 w-full sm:max-w-[80%] min-w-0 flex-1">
                                            <div className="flex flex-wrap gap-1.5">
                                                {post.tags?.map((tag: string) => (
                                                    <span key={tag} className="text-[8px] font-black text-mint-dark bg-mint-default/5 px-2.5 py-1 rounded-md uppercase tracking-wider border border-mint-dark/10">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-neutral-900 group-hover:text-mint-dark transition-colors leading-snug wrap-break-word max-w-full">
                                                {post.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-t border-neutral-50 pt-3 w-full">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="size-5 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden relative flex items-center justify-center shrink-0">
                                                        {post.authorPhoto ? (
                                                            <Image src={post.authorPhoto} alt="" fill className="object-cover" />
                                                        ) : (
                                                            <User size={10} className="text-neutral-400" />
                                                        )}
                                                    </div>
                                                    <span className="text-neutral-600 font-bold truncate max-w-30">{post.authorName}</span>
                                                </div>
                                                <span className="text-neutral-300 hidden sm:inline">•</span>
                                                <span className="flex items-center gap-1.5 text-neutral-500 shrink-0">
                                                    <MessageSquare size={12} className="text-neutral-400" /> 
                                                    {post.replies || 0} {post.replies === 1 ? 'Reply' : 'Replies'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto bg-neutral-50 sm:bg-transparent px-4 py-3 sm:p-0 rounded-xl sm:self-stretch border sm:border-0 border-neutral-100 shrink-0">
                                            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest sm:hidden">Score Allocation</span>
                                            <div className="flex items-center gap-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                                                <span className="text-xl md:text-2xl font-black text-neutral-300 group-hover:text-neutral-900 transition-colors">
                                                    {post.karma ? `${post.karma > 0 ? "+" : ""}${post.karma}` : "0"}
                                                </span>
                                                <KarmaIcon size={16} className={`text-neutral-300 transition-colors ${karmaColor}`} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="relative lg:col-span-4 order-1 lg:order-2 w-full min-h-full ">
                        <div 
                            ref={sidebarRef} 
                            className="space-y-6 transition-shadow duration-200 lg:absolute lg:w-full lg:top-0"
                        >
                            {!user ? (
                                <div className="p-8 bg-neutral-900 rounded-4xl text-white space-y-6 border border-neutral-800 shadow-xl relative overflow-hidden group">
                                    <div className="absolute -right-6 -top-6 size-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                                    <div className="size-11 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                        <Lock size={18} className="text-mint-light" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold uppercase tracking-tight">Join the Discussion</h4>
                                        <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                                            Authenticate your platform access token to upvote trending threads, compile answers, and submit system tracks.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => startTransition("/auth")}
                                        className="magnetic cursor-pointer w-full py-4 bg-mint-dark text-white hover:bg-white hover:text-neutral-900 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors duration-300 hover:shadow-lg hover:shadow-mint-dark/10"
                                    >
                                        Get Access Key
                                    </button>
                                </div>
                            ) : (
                                <div className="p-6 md:p-8 bg-white border border-neutral-200 rounded-4xl space-y-6 shadow-sm">
                                    <div className="flex items-center gap-4 bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                                        <div className="size-11 bg-neutral-200 rounded-xl overflow-hidden relative border border-neutral-300 flex items-center justify-center shrink-0">
                                            {user.photoURL ? (
                                                <Image src={user.photoURL} alt="" fill className="object-cover" />
                                            ) : (
                                                <User size={16} className="text-neutral-400" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold uppercase text-xs text-neutral-800 truncate">{user.displayName || "Anonymous Scholar"}</h4>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <ArrowUp size={10} className="text-mint-dark" />
                                                <span className="text-[9px] text-mint-dark font-black uppercase tracking-wider">Karma Allocation: {user.stats?.karma || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {user.privileges?.includes("forum:create") ? (
                                        <button 
                                            onClick={() => startTransition("/forum/create")} 
                                            className="magnetic cursor-pointer w-full py-4 bg-neutral-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-mint-dark transition-colors duration-300 shadow-md shadow-neutral-950/5"
                                        >
                                            Start a Discussion
                                        </button>
                                    ) : (
                                        <div className="w-full py-3.5 px-4 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center gap-3 select-none">
                                            <Lock size={14} className="text-neutral-400 shrink-0" />
                                            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 leading-none">
                                                Creation Track Suspended
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="p-6 md:p-8 bg-white border border-neutral-200/80 rounded-4xl space-y-5 shadow-sm">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                                    <Layers size={10} />
                                    System Performance Track
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-neutral-50/60 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors">
                                        <span className="block text-2xl font-black text-neutral-900 tracking-tight">12.4k</span>
                                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider block mt-1">Active Scholars</span>
                                    </div>
                                    <div className="p-4 bg-neutral-50/60 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors">
                                        <span className="block text-2xl font-black text-neutral-900 tracking-tight">842</span>
                                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider block mt-1">Solved Queries</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}