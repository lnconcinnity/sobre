/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { 
    ArrowLeft, 
    Send, 
    Globe, 
    MessageSquare, 
    ChevronUp, 
    ChevronDown, 
    Sparkles, 
    User, 
    ArrowUp, 
    Layers,
    Lock
} from "lucide-react";
import Image from "next/image";
import { useTransition } from "@/src/hooks/useTransition";
import gsap from "@/src/modules/gsap";

const MAX_DEPTH = 3;

const VoteSideview = ({ karma, handleVote, userVote }: any) => (
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

const CommentNode = ({ comment, allComments, onReply, user, postId, allVotes = {}, checkAuthOrRedirect }: any) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    
    const children = allComments.filter((c: any) => c.parentId === comment.id);
    const currentUserVote = allVotes[comment.id] || 0;
    const isDepthLimitReached = comment.depth >= MAX_DEPTH;

    const handleCommentVote = async (targetValue: number) => {
        if ((checkAuthOrRedirect && !checkAuthOrRedirect(user)) || !user) return;
        const voteRef = doc(db, "posts", postId, "userCommentVotes", user.uid, "votes", comment.id);
        const commentRef = doc(db, "posts", postId, "comments", comment.id);
        const authorRef = doc(db, "users", comment.authorId);
        const existingVote = currentUserVote;

        let karmaChange = 0;
        let newVoteValue = 0;

        if (existingVote === targetValue) {
            karmaChange = -targetValue;
            newVoteValue = 0;
        } else {
            karmaChange = targetValue - existingVote;
            newVoteValue = targetValue;
        }

        try {
            await setDoc(voteRef, { value: newVoteValue });
            await updateDoc(commentRef, { karma: increment(karmaChange) });
            await updateDoc(authorRef, { "stats.karma": increment(karmaChange) });
        } catch (e) {
            console.error("Comment vote failed:", e);
        }
    };

    return (
       <div className={`mt-6 w-full min-w-0 ${comment.depth > 0 ? "pl-3 md:pl-8 border-l border-neutral-200/60" : ""}`}>
            <div className="flex gap-2 md:gap-4 group items-start w-full min-w-0">
                <div className="relative size-7 md:size-8 rounded-full bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200/50 shadow-xs flex items-center justify-center">
                    {comment.authorPhoto ? (
                        <Image src={comment.authorPhoto} alt="" fill className="object-cover" />
                    ) : (
                        <User size={12} className="text-neutral-400" />
                    )}
                </div>
                
                <VoteSideview handleVote={handleCommentVote} karma={comment.karma} userVote={currentUserVote} />
                <div className="flex-1 min-w-0">
                    <div className="bg-white border border-neutral-200/80 rounded-4xl rounded-tl-none p-4 md:p-6 shadow-xs group-hover:border-neutral-900 transition-all duration-300 w-full base-container">
                        <div className="flex justify-between items-center mb-2 gap-2">
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-800 truncate">
                                {comment.authorName || "Anonymous Scholar"}
                            </p>
                            <span className="text-[8px] md:text-[9px] font-black text-neutral-300 uppercase tracking-widest shrink-0">
                                {comment.createdAt ? "Synced" : "Sending..."}
                            </span>
                        </div>
                        <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium break-words whitespace-normal overflow-hidden">
                            {comment.text}
                        </p>
                    </div>

                    {!isDepthLimitReached && (
                        <div className="flex gap-4 mt-2 ml-2">
                            <button 
                                onClick={() => setIsReplying(!isReplying)}
                                className={`magnetic cursor-pointer text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 ${isReplying ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'}`}
                            >
                                <MessageSquare size={10} /> {isReplying ? "Cancel" : "Reply Track"}
                            </button>
                        </div>
                    )}

                    {isReplying && !isDepthLimitReached && (
                        <div className="mt-4 flex gap-3 items-end animate-in fade-in slide-in-from-top-2 duration-200">
                            <textarea 
                                autoFocus
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Append point data..."
                                className="flex-1 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-neutral-900 outline-none resize-none transition-all placeholder:text-neutral-400"
                                rows={2}
                            />
                            <button 
                                onClick={() => {
                                    if (!replyText.trim()) return;
                                    onReply(replyText, comment.id, comment.depth + 1);
                                    setReplyText("");
                                    setIsReplying(false);
                                }}
                                className="bg-neutral-900 text-white p-4 rounded-xl hover:bg-mint-dark transition-colors shadow-md shrink-0 cursor-pointer"
                            >
                                <Send size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="w-full min-w-0">
                {children.map((child: any) => (
                    <CommentNode 
                        key={child.id} 
                        comment={child} 
                        allComments={allComments} 
                        onReply={onReply} 
                        user={user} 
                        postId={postId} 
                        allVotes={allVotes} 
                        checkAuthOrRedirect={checkAuthOrRedirect} 
                    />
                ))}
            </div>
        </div>
    );
};

export default function PostDetailPage() {
    const { postId } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentInput, setCommentInput] = useState("");
    const { startTransition } = useTransition();
    const [userVote, setUserVote] = useState(0);
    const [commentVotes, setCommentVotes] = useState<Record<string, number>>({});

    const gridRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getPost = async () => {
            const docRef = doc(db, "posts", postId as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setPost(docSnap.data());
        };
        getPost();
    }, [postId]);

    useEffect(() => {
        const q = query(
            collection(db, "posts", postId as string, "comments"), 
            orderBy("createdAt", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (error) => console.error("Snapshot error:", error));

        return () => unsubscribe();
    }, [postId]);
    
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "posts", postId as string, "userCommentVotes", user.uid, "votes"));
        const unsubscribeComments = onSnapshot(q, (snapshot) => {
            const votes: Record<string, number> = {};
            snapshot.docs.forEach(doc => {
                votes[doc.id] = doc.data().value;
            });
            setCommentVotes(votes);
        });

        const unsubscribePost = onSnapshot(doc(db, "posts", postId as string, "votes", user.uid), (doc) => {
            if (doc.exists()) setUserVote(doc.data().value);
        });
        return () => {
            unsubscribeComments();
            unsubscribePost();
        };
    }, [user, postId]);

    useEffect(() => {
        const sidebarNode = sidebarRef.current;
        const gridNode = gridRef.current;

        if (!gridNode || !sidebarNode) return;

        const handleScroll = () => {
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

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
        
        const resizeObserver = new ResizeObserver(() => handleScroll());
        resizeObserver.observe(gridNode);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            resizeObserver.disconnect();
            gsap.killTweensOf(sidebarNode);
        };
    }, [comments, post]);

    const checkAuthOrRedirect = (user: any) => {
        if (!user) {
            const currentPath = window.location.pathname;
            startTransition(`/auth?redirect=${encodeURIComponent(currentPath)}`);
            return false;
        }
        return true;
    };

    const submitComment = async (text: string, parentId: string | null = null, depth: number = 0) => {
        if (!checkAuthOrRedirect(user) || !text.trim()) return;
        try {
            await addDoc(collection(db, "posts", postId as string, "comments"), {
                text,
                parentId,
                depth,
                authorId: user!.uid,
                authorName: user!.displayName,
                authorPhoto: user!.photoURL,
                createdAt: serverTimestamp(),
                karma: 0,
            });

            const postRef = doc(db, "posts", postId as string);
            await updateDoc(postRef, {
                replies: increment(1)
            });
        } catch (e) {
            console.error("Post error:", e);
        }
    };

    const handlePostVote = async (targetValue: number) => {
        if (!checkAuthOrRedirect(user)) return;

        const voteRef = doc(db, "posts", postId as string, "votes", user!.uid);
        const postRef = doc(db, "posts", postId as string);
        const authorRef = doc(db, "users", post.authorId);
        
        const voteSnap = await getDoc(voteRef);
        const existingVote = voteSnap.exists() ? voteSnap.data().value : 0;

        let karmaChange = 0;
        let newVoteValue = 0;

        if (existingVote === targetValue) {
            karmaChange = -targetValue;
            newVoteValue = 0;
        } else {
            karmaChange = targetValue - existingVote;
            newVoteValue = targetValue;
        }
        setPost((prev: any) => ({ ...prev, karma: (prev.karma || 0) + karmaChange }));

        try {
            await setDoc(voteRef, { value: newVoteValue });
            await updateDoc(postRef, { karma: increment(karmaChange) });
            await updateDoc(authorRef, {
                "stats.karma": increment(karmaChange)
            });
        } catch (e) {
            console.error("Vote failed", e);
        }
    };

    if (!post) return null;
    const rootComments = comments.filter(c => !c.parentId);

    return (
        <div className="relative min-h-screen bg-[#fbfdfb] pt-20 sm:pt-28 md:pt-36 pb-24 px-4 sm:px-8 md:px-16 overflow-hidden">
            <div 
                className="absolute inset-0 z-0 bg-architectural-grid bg-size-[4rem_4rem] opacity-40 pointer-events-none" 
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    willChange: "transform",
                    transform: "translateZ(0)"
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-3 mb-10 md:mb-12">
                    <button 
                        onClick={() => startTransition("/forum")} 
                        className="w-fit rounded-full cursor-pointer magnetic flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                        <ArrowLeft size={12} /> Back to archives
                    </button>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black text-mint-dark uppercase tracking-[0.3em] block">
                            Archive Segment Node
                        </span>
                        <Sparkles size={12} className="text-mint-dark animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-neutral-900 uppercase leading-[0.95] tracking-tighter max-w-4xl">
                        {post.title} <br />
                        <span className="text-transparent italic font-serif font-light tracking-wide pl-1" style={{ WebkitTextStroke: "1px #263127" }}>
                            Thread Review.
                        </span>
                    </h1>
                </div>
                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative w-full min-w-0">
                    <div className="lg:col-span-8 space-y-6 min-w-0 w-full"> 
                        <article className="bg-white border border-neutral-200 rounded-4xl p-6 md:p-8 shadow-xs w-full">
                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {post.tags?.map((tag: string) => (
                                    <span key={tag} className="text-[8px] font-black text-mint-dark bg-mint-default/5 px-2.5 py-1 rounded-md uppercase tracking-wider border border-mint-dark/10">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            
                            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap break-words mb-8">
                                {post.content}
                            </p>

                            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <VoteSideview handleVote={handlePostVote} karma={post.karma} userVote={userVote} />
                                    <div className="relative size-6 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                                        {post.authorPhoto ? (
                                            <Image src={post.authorPhoto} alt="" fill className="object-cover" />
                                        ) : (
                                            <User size={12} className="text-neutral-400" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">{post.authorName}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                    <Globe size={12} />
                                    <span>Public Segment</span>
                                </div>
                            </div>
                        </article>
                        
                        <div className="space-y-4 w-full min-w-0">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 ml-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                                    Discussion Tracks ({comments.length})
                                </h4>
                            </div>

                            <div className="w-full min-w-0 space-y-4">
                                {rootComments.length > 0 ? (
                                    rootComments.map((comment) => (
                                        <CommentNode 
                                            key={comment.id} 
                                            comment={comment} 
                                            allComments={comments} 
                                            onReply={submitComment} 
                                            user={user}
                                            postId={postId}
                                            allVotes={commentVotes}
                                            checkAuthOrRedirect={checkAuthOrRedirect}
                                        />
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-white border border-neutral-200 rounded-4xl">
                                        <p className="text-neutral-400 text-xs font-medium italic">The thread timeline is empty. Append perspective below.</p>
                                    </div>
                                )}
                            </div>
                            
                            {user && (
                                <div className="pt-6 w-full">
                                     <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2 block mb-3">
                                        Append Collective intelligence
                                     </label>
                                     <div className="relative w-full">
                                        <textarea 
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                            placeholder="Add constructive notes or system enhancements..."
                                            className="w-full p-6 bg-white border border-neutral-200 rounded-3xl focus:border-neutral-900 focus:outline-none text-xs md:text-sm font-semibold shadow-xs transition-all placeholder:text-neutral-400 text-neutral-800"
                                            rows={3}
                                        />
                                        <button 
                                            onClick={() => {
                                                if (!commentInput.trim()) return;
                                                submitComment(commentInput);
                                                setCommentInput("");
                                            }}
                                            className="magnetic absolute bottom-4 right-4 p-3.5 bg-neutral-900 text-white rounded-xl hover:bg-mint-dark transition-colors cursor-pointer shadow-md"
                                        >
                                            <Send size={14} />
                                        </button>
                                     </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-4 order-1 lg:order-2 w-full min-h-full relative">
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
                                        <h4 className="text-lg font-bold uppercase tracking-tight">Access Token Required</h4>
                                        <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                                            Authenticate your platform access credentials to upvote parameters, append notes, and contribute to tracks.
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
                                    <button 
                                        onClick={() => startTransition("/forum/create")} 
                                        className="magnetic cursor-pointer w-full py-4 bg-neutral-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-mint-dark transition-colors duration-300 shadow-md shadow-neutral-950/5"
                                    >
                                        Start a Discussion
                                    </button>
                                </div>
                            )}

                            <div className="p-6 md:p-8 bg-white border border-neutral-200/80 rounded-4xl space-y-5 shadow-sm">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                                    <Layers size={10} />
                                    Section Parameter Track
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-neutral-50/60 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors">
                                        <span className="block text-2xl font-black text-neutral-900 tracking-tight">{comments.length}</span>
                                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider block mt-1">Total Tracks</span>
                                    </div>
                                    <div className="p-4 bg-neutral-50/60 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors">
                                        <span className="block text-2xl font-black text-neutral-900 tracking-tight">
                                            {post.karma ? `${post.karma > 0 ? "+" : ""}${post.karma}` : "0"}
                                        </span>
                                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider block mt-1">Net Weight</span>
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