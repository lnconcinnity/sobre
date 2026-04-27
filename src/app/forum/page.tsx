"use client";
import { useMemo, useState } from "react";
import { MessageSquare, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useTransition } from "@/src/hooks/useTransition";
import Image from "next/image";
import { usePosts } from "@/src/hooks/usePosts";

export default function ForumPage() {
    const { user } = useAuth();
    const { startTransition } = useTransition();
    const [activeTab, setActiveTab] = useState("trending");
    const { posts, loading: postsLoading } = usePosts();

    const sortedPosts = useMemo(() => {
        if (!posts) return [];
        const filtered = [...posts];
        switch (activeTab) {
            case "trending":
                return filtered.sort((a, b) => {
                    if (b.karma !== a.karma) return (b.karma || 0) - (a.karma || 0);
                    return b.createdAt?.seconds - a.createdAt?.seconds;
                });
            
            case "unsolved":
                return filtered
                    .filter(post => (post.replies || 0) === 0)
                    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
            
            case "latest":
            default:
                return filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        }
    }, [posts, activeTab]);

    return (
        <div className="min-h-screen bg-neutral-50 pt-32 pb-24 px-8 md:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <span className="text-[10px] font-black text-mint-dark uppercase tracking-[0.3em] mb-4 block">
                            The Collective Intelligence
                        </span>
                        <h1 className="text-6xl font-black text-black uppercase tracking-tighter">
                            Student <span className="text-neutral-300">Forum.</span>
                        </h1>
                    </div>
                    <div className="flex bg-white p-1 rounded-2xl border border-neutral-200">
                        {["Trending", "Latest", "Unsolved"].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`cursor-pointer magnetic px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                                    activeTab === tab.toLowerCase() ? "bg-black text-white" : "text-neutral-400 hover:text-black"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-4">
                        {postsLoading ? (
                            <div className="flex flex-col items-center py-20 text-neutral-300">
                                <Loader2 className="animate-spin mb-4" size={32} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Querying the collective...</span>
                            </div>
                        ) : sortedPosts.length === 0 ? (
                            <div className="p-20 text-center border-2 border-dashed border-neutral-200 rounded-[40px]">
                                <p className="text-neutral-400 font-medium italic">The archives are empty. Be the first to speak.</p>
                            </div>
                        ) : (
                            sortedPosts.map((post) => (
                                <div 
                                    key={post.id}
                                    onClick={() => startTransition(`/forum/${post.id}`)}
                                    className="magnetic group p-8 bg-white border border-neutral-100 rounded-4xl hover:border-black transition-colors cursor-pointer flex justify-between items-center"
                                >
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            {post.tags?.map((tag: string) => (
                                                <span key={tag} className="text-[8px] font-black text-mint-dark bg-mint-light/10 px-2 py-1 rounded-md uppercase">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-mint-dark transition-colors">{post.title}</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <div className="size-4 rounded-full bg-neutral-200 overflow-hidden relative">
                                                    {post.authorPhoto && <Image src={post.authorPhoto} alt="" fill className="object-cover" />}
                                                </div>
                                                <span>{post.authorName}</span>
                                            </div>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><MessageSquare size={12}/> {post.replies || 0} Replies</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-neutral-200 group-hover:text-black transition-colors">
                                            {post.karma ? `${Math.sign(post.karma) === -1 ? "-" : "+"} ${Math.abs(post.karma)}` : 0}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        {!user ? (
                            <div className="p-8 bg-[#263127] rounded-[40px] text-white space-y-6">
                                <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Lock size={20} className="text-mint-light" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 uppercase">Join the Discussion</h4>
                                    <p className="text-white/50 text-sm font-medium leading-relaxed">
                                        Sign in to upvote, comment, and share your own experiences with the community.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => startTransition("/auth")}
                                    className="magnetic cursor-pointer w-full py-4 bg-mint-light text-[#263127] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors"
                                >
                                    Get Access
                                </button>
                            </div>
                        ) : (
                            <div className="p-8 bg-white border border-neutral-200 rounded-[40px] space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-neutral-100 rounded-full" />
                                    <div>
                                        <h4 className="font-bold uppercase text-xs">{user.displayName}</h4>
                                        <span className="text-[10px] text-mint-dark font-black uppercase">Karma: {user.stats.karma}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => startTransition("/forum/create")} 
                                    className="magnetic cursor-pointer w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-mint-dark transition-colors"
                                >
                                    Start a Discussion
                                </button>
                            </div>
                        )}

                        <div className="p-8 border border-neutral-100 rounded-[40px] space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Community Stats</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-neutral-50 rounded-2xl">
                                    <span className="block text-xl font-black">12.4k</span>
                                    <span className="text-[8px] font-bold text-neutral-400 uppercase">Active Scholars</span>
                                </div>
                                <div className="p-4 bg-neutral-50 rounded-2xl">
                                    <span className="block text-xl font-black">842</span>
                                    <span className="text-[8px] font-bold text-neutral-400 uppercase">Solved Queries</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}