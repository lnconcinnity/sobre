/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, increment, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { ArrowLeft, Send, Globe, Layers, Flag, Trash2, MoreHorizontal } from "lucide-react";
import { useTransition } from "@/src/hooks/useTransition";
import gsap, { useGSAP } from "@/src/modules/gsap";

import VoteSideview from "./VoteSideview";
import CommentNode from "./CommentNode";
import ReportModal from "./ReportModal";
import ImageGallery from "./ImageGallery";
import ImageDisplay from "./ImageDisplay";
import { useToast } from "@/src/hooks/useToast";

export default function PostDetailsPage({ isRedirected }: { isRedirected: boolean }) {
    const { postId } = useParams();
    const { user } = useAuth();
    const { startTransition } = useTransition();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentInput, setCommentInput] = useState("");
    const [userVote, setUserVote] = useState(0);
    const [commentVotes, setCommentVotes] = useState<Record<string, number>>({});
    const [reportTarget, setReportTarget] = useState<{ type: "post" | "comment"; id: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { warning, success, confirm } = useToast();

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

    useGSAP(() => {
        if (isMenuOpen) {
            gsap.fromTo(".menu-dropdown", 
                { opacity: 0, y: 5 }, 
                { opacity: 1, y: 0, duration: 0.2 }
            );
        }
    }, { dependencies: [isMenuOpen] });

    useEffect(() => {
        const q = query(collection(db, "posts", postId as string, "comments"), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (snap) => setComments(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        return () => unsubscribe();
    }, [postId]);
    
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "posts", postId as string, "userCommentVotes", user.uid, "votes"));
        const unsubComments = onSnapshot(q, (snap) => {
            const votes: Record<string, number> = {};
            snap.docs.forEach(d => votes[d.id] = d.data().value);
            setCommentVotes(votes);
        });
        const unsubPost = onSnapshot(doc(db, "posts", postId as string, "votes", user.uid), (d) => {
            if (d.exists()) setUserVote(d.data().value);
        });
        return () => { unsubComments(); unsubPost(); };
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
            const desiredTop = window.scrollY - gridNode.offsetTop + 144;
            const clampedTop = Math.max(0, Math.min(desiredTop, gridNode.offsetHeight - sidebarNode.offsetHeight));
            gsap.to(sidebarNode, { top: clampedTop, duration: 1, ease: "sine.out", overwrite: "auto" });
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
        return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("resize", handleScroll); };
    }, [comments, post]);

    const checkAuthOrRedirect = (userInstance: any) => {
        if (!userInstance) {
            startTransition(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
            return false;
        }
        return true;
    };

    const submitComment = async (text: string, parentId: string | null = null, depth: number = 0) => {
        if (!checkAuthOrRedirect(user) || !text.trim()) return;

        try {
            await runTransaction(db, async (transaction) => {
                const postRef = doc(db, "posts", postId as string);
                const userRef = doc(db, "users", user!.uid);
                const commentRef = doc(collection(db, "posts", postId as string, "comments"));

                transaction.set(commentRef, {
                    text, parentId, depth,
                    authorId: user!.uid, authorName: user!.displayName, authorPhoto: user!.photoURL,
                    createdAt: serverTimestamp(), karma: 0,
                });
                transaction.update(postRef, { replies: increment(1) });
                transaction.update(userRef, { "stats.commentCount": increment(1) });
            });
        } catch (e) {
            console.error("Transaction failed:", e);
        }
    };

    const handlePostVote = async (targetValue: number) => {
        if (!checkAuthOrRedirect(user)) return;

        const postRef = doc(db, "posts", postId as string);
        const voteRef = doc(db, "posts", postId as string, "votes", user!.uid);
        const authorRef = doc(db, "users", post.authorId);

        let karmaChange = targetValue - userVote;
        if (userVote === targetValue) { karmaChange = -targetValue; targetValue = 0; }

        try {
            await runTransaction(db, async (transaction) => {
                transaction.set(voteRef, { value: targetValue });
                transaction.update(postRef, { karma: increment(karmaChange) });
                transaction.update(authorRef, { "stats.karma": increment(karmaChange) });
            });
            setPost((p: any) => ({ ...p, karma: (p.karma || 0) + karmaChange }));
            setUserVote(targetValue);
        } catch (e) {
            console.error("Vote transaction failed:", e);
        }
    };

    const submitReport = async (reason: string, details: string) => {
        if (!user || !reportTarget) return;
        try {
            await addDoc(collection(db, "reports"), {
                targetType: reportTarget.type,
                targetId: reportTarget.id,
                postId: postId,
                reporterId: user.uid,
                reason,
                details,
                status: "pending",
                createdAt: serverTimestamp()
            });
            success("Content flagged successfully. System moderators notified.");
        } catch (e) {
            console.error("Report dispatch fault:", e);
        }
    };

    const handleDeletePost = async () => {
        if (!await confirm("Are you sure you want to delete this thread? This action cannot be undone.")) return;

        try {
            if (post.attachments?.length > 0) {
                await fetch("/api/user/remove-attachment", { method: "POST", body: JSON.stringify({ urls: post.attachments }) });
            }

            const postRef = doc(db, "posts", postId as string);
            const hasReplies = comments.length > 0;

            if (hasReplies) {
                await updateDoc(postRef, {
                    title: "[Deleted]",
                    content: "[This thread has been archived and removed by the author.]",
                    attachments: [],
                    isDeleted: true
                });
                setPost((p: any) => ({ ...p, title: "[Deleted]", content: "[...]" }));
                warning("Thread tombstoned.");
            } else {
                await runTransaction(db, async (transaction) => {
                    transaction.delete(postRef);
                    transaction.update(doc(db, "users", user!.uid), { "stats.postCount": increment(-1) });
                });
                startTransition("/forum");
            }
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    if (!post) return null;
    const rootComments = comments.filter(c => !c.parentId);

    return (
        <div className="relative min-h-screen bg-[#fbfdfb] pt-20 sm:pt-28 md:pt-36 pb-24 px-4 sm:px-8 md:px-16 overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-3 mb-10 md:mb-12">
                    <button onClick={() => startTransition(isRedirected ? "/forum" : undefined)} className="w-fit rounded-full cursor-pointer magnetic flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">
                        <ArrowLeft size={12} /> Back to archives
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black text-neutral-900 uppercase leading-[0.95] tracking-tighter max-w-4xl">
                        {post.title} <br />
                        <span className="text-transparent italic font-serif font-light tracking-wide pl-1" style={{ WebkitTextStroke: "1px #263127" }}>Thread Review.</span>
                    </h1>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative w-full min-w-0">
                    <div className="lg:col-span-8 space-y-6 min-w-0 w-full"> 
                        <article className="bg-white border border-neutral-200 rounded-4xl p-6 md:p-8 shadow-xs w-full group relative">
                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {post.tags?.map((t: string) => (
                                    <span key={t} className="text-[8px] font-black text-mint-dark bg-mint-default/5 px-2.5 py-1 rounded-md uppercase tracking-wider border border-mint-dark/10">#{t}</span>
                                ))}
                            </div>
                            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap mb-8">{post.content}</p>
                            <ImageGallery 
                                attachments={post.attachments || []} 
                                onOpen={(url) => setSelectedImage(url)} 
                            />
                            <ImageDisplay 
                                url={selectedImage} 
                                onClose={() => setSelectedImage(null)} 
                            />
                            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <VoteSideview handleVote={handlePostVote} karma={post.karma} userVote={userVote} />
                                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">{post.authorName}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="ml-auto relative">
                                        <button 
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="magnetic rounded-full cursor-pointer text-neutral-400 hover:text-neutral-900 transition-colors p-1"
                                        >
                                            <MoreHorizontal size={16} />
                                        </button>
                                        {isMenuOpen && (
                                            <div className="menu-dropdown absolute right-0 bottom-full mb-2 bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1" style={{ width: "9rem" }}>
                                                {user && user.uid === post.authorId && (
                                                    <button 
                                                        onClick={() => { handleDeletePost(); setIsMenuOpen(false); }}
                                                        className="magnetic text-[10px] font-black uppercase tracking-widest text-red-600 p-2 cursor-pointer rounded-lg flex items-center gap-2"
                                                    >
                                                        <Trash2 size={12} /> Delete Post
                                                    </button>
                                                )}
                                                {user && (
                                                    <button 
                                                        onClick={() => setReportTarget({ type: "post", id: postId as string })}
                                                        className="magnetic text-[10px] font-black uppercase tracking-widest text-neutral-700 p-2 cursor-pointer  rounded-lg flex items-center gap-2"
                                                    >
                                                        <Flag size={12} /> Flag Post
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest"><Globe size={12} /><span>Public Segment</span></div>
                                </div>
                            </div>
                        </article>
                        <div className="space-y-4 w-full min-w-0">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 border-b border-neutral-100 pb-3 ml-2">Discussion Tracks ({comments.length})</h4>
                            <div className="w-full min-w-0 space-y-4">
                                {rootComments.length > 0 ? (
                                    rootComments.map((c) => (
                                        <CommentNode 
                                            key={c.id} comment={c} allComments={comments} onReply={submitComment} user={user} postId={postId} allVotes={commentVotes} checkAuthOrRedirect={checkAuthOrRedirect}
                                            openReportModal={(type: "post" | "comment", id: string) => setReportTarget({ type, id })}
                                        />
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-white border border-neutral-200 rounded-4xl"><p className="text-neutral-400 text-xs font-medium italic">Timeline clear.</p></div>
                                )}
                            </div>
                            {user && (
                                <div className="pt-6 w-full">
                                    {user.privileges?.includes("forum:reply") ? (
                                        <div className="relative w-full">
                                            <textarea value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Add constructive notes..." className="w-full p-6 bg-white border border-neutral-200 rounded-3xl focus:border-neutral-900 outline-none text-xs md:text-sm font-semibold transition-all" rows={3} />
                                            <button onClick={() => { if (!commentInput.trim()) return; submitComment(commentInput); setCommentInput(""); }} className="absolute bottom-4 right-4 p-3.5 bg-neutral-900 text-white rounded-xl hover:bg-mint-dark transition-colors cursor-pointer"><Send size={14} /></button>
                                        </div>
                                    ) : (
                                        <div className="w-full p-6 bg-neutral-50 border border-neutral-200 border-dashed rounded-3xl flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-neutral-400 select-none"><span>Write Access Silenced</span><span>Read-Only Mode</span></div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-4 order-1 lg:order-2 w-full min-h-full relative">
                        <div ref={sidebarRef} className="space-y-6 lg:absolute lg:w-full lg:top-0">
                            <div className="p-6 md:p-8 bg-white border border-neutral-200 rounded-4xl space-y-5">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2"><Layers size={10} />Parameter Metrics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-neutral-50/60 border border-neutral-100 rounded-2xl"><span className="block text-2xl font-black text-neutral-900">{comments.length}</span><span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider block mt-1">Tracks</span></div>
                                    <div className="p-4 bg-neutral-50/60 border border-neutral-100 rounded-2xl"><span className="block text-2xl font-black text-neutral-900">{post.karma || 0}</span><span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider block mt-1">Weight</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ReportModal 
                isOpen={!!reportTarget} 
                onClose={() => setReportTarget(null)} 
                onSubmit={submitReport} 
                targetType={reportTarget?.type || "post"} 
            />
        </div>
    );
}