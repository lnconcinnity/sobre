/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { doc, increment, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import { MessageSquare, Lock, Send, User, Flag, Eye, EyeOff, Trash2, MoreHorizontal } from "lucide-react";
import VoteSideview from "./VoteSideview";
import gsap, { useGSAP } from "@/src/modules/gsap";

const MAX_DEPTH = 3;

export default function CommentNode({ comment, allComments, onReply, user, postId, allVotes = {}, checkAuthOrRedirect, openReportModal }: any) {
    const [isReplying, setIsReplying] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [replyText, setReplyText] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const replyRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const children = allComments.filter((c: any) => c.parentId === comment.id);
    const currentUserVote = allVotes[comment.id] || 0;
    const isDepthLimitReached = comment.depth >= MAX_DEPTH;
    const [isVoting, setIsVoting] = useState(false);

    useGSAP(() => {
        if (isReplying) {
            gsap.fromTo(replyRef.current, 
                { opacity: 0, height: 0 }, 
                { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" }
            );
        }
    }, { dependencies: [isReplying], scope: containerRef });
    
    useGSAP(() => {
        if (isCollapsed) {
            gsap.to(childrenRef.current, { height: 0, opacity: 0, duration: 0.3 });
        } else {
            gsap.to(childrenRef.current, { height: "auto", opacity: 1, duration: 0.3 });
        }
    }, { dependencies: [isCollapsed], scope: containerRef });

    useGSAP(() => {
        if (isMenuOpen) {
            gsap.fromTo(".menu-dropdown", 
                { opacity: 0, y: 5 }, 
                { opacity: 1, y: 0, duration: 0.2 }
            );
        }
    }, { dependencies: [isMenuOpen] });

    const handleCommentVote = async (targetValue: number) => {
        if (!user || isVoting) return;
        setIsVoting(true);

        const voteRef = doc(db, "posts", postId, "userCommentVotes", user.uid, "votes", comment.id);
        const commentRef = doc(db, "posts", postId, "comments", comment.id);
        const authorRef = doc(db, "users", comment.authorId);

        let karmaChange = targetValue - currentUserVote;
        if (currentUserVote === targetValue) {
            karmaChange = -targetValue;
            targetValue = 0;
        }

        try {
            await runTransaction(db, async (transaction) => {
                transaction.set(voteRef, { value: targetValue });
                transaction.update(commentRef, { karma: increment(karmaChange) });
                transaction.update(authorRef, { "stats.karma": increment(karmaChange) });
            });
        } catch (e) {
            console.error("Comment vote transaction failed:", e);
        } finally {
            setIsVoting(false);
        }
    };

    const handleDelete = async () => {
        const hasChildren = children.length > 0;
        if (comment.attachments?.length > 0) {
            await fetch("/api/user/remove-attachment", { method: "POST", body: JSON.stringify({ urls: comment.attachments }) })
        }

        if (hasChildren) {
            await updateDoc(doc(db, "posts", postId, "comments", comment.id), {
                text: "[Deleted]",
                authorName: "Deleted",
                authorId: null,
                authorPhoto: null,
                attachments: [],
                isDeleted: true
            });
        } else {
            await runTransaction(db, async (transaction) => {
                transaction.delete(doc(db, "posts", postId, "comments", comment.id));
                transaction.update(doc(db, "posts", postId), { replies: increment(-1) });
                transaction.update(user, { "stats.commentCount": increment(-1) });
            });
        }
    };

    return (
       <div className={`mt-6 w-full min-w-0 ${comment.depth > 0 ? "pl-3 md:pl-8 border-l border-neutral-200/60" : ""}`}>
            <div ref={containerRef} className="flex gap-2 md:gap-4 group items-start w-full min-w-0">
                <div className="relative size-7 md:size-8 rounded-full bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200/50 flex items-center justify-center">
                    {comment.authorPhoto ? (
                        <Image src={comment.authorPhoto} alt="" fill className="object-cover" />
                    ) : (
                        <User size={12} className="text-neutral-400" />
                    )}
                </div>
                { comment.authorId !== null && (
                    <VoteSideview handleVote={handleCommentVote} karma={comment.karma} userVote={currentUserVote} />
                )}
                <div className="flex-1 min-w-0">
                    {!isCollapsed ? (
                        <div className="bg-white border border-neutral-200/80 rounded-4xl rounded-tl-none p-4 md:p-6 shadow-xs group-hover:border-neutral-900 transition-all duration-300 w-full">
                            <div className="flex justify-between items-center mb-2 gap-2">
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-800 truncate">
                                    {comment.authorName || "Anonymous Scholar"}
                                </p>
                                <span className="text-[8px] md:text-[9px] font-black text-neutral-300 uppercase tracking-widest shrink-0">
                                    {comment.createdAt ? "Synced" : "Sending..."}
                                </span>
                            </div>
                            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium wrap-break-word whitespace-normal overflow-hidden">
                                {comment.text}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-neutral-50 border border-neutral-200 border-dashed rounded-xl px-4 py-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-2">
                            <span>Thread track collapsed by user</span>
                            <span className="text-neutral-300">({children.length} nested records)</span>
                        </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 ml-2">
                        {!isCollapsed && !isDepthLimitReached && (
                            <>
                                {user?.privileges?.includes("forum:reply") ? (
                                    <button 
                                        onClick={() => setIsReplying(!isReplying)}
                                        className={`magnetic cursor-pointer text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 ${isReplying ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'}`}
                                    >
                                        <MessageSquare size={10} /> {isReplying ? "Cancel" : "Reply Track"}
                                    </button>
                                ) : (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-300 flex items-center gap-1 cursor-not-allowed select-none">
                                        <Lock size={9} /> Reply Suspended
                                    </span>
                                )}
                            </>
                        )}
                        {children.length > 0 && (
                            <button 
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                {isCollapsed ? <Eye size={10} /> : <EyeOff size={10} />}
                                {isCollapsed ? `Expand [${children.length}]` : "Hide Replies"}
                            </button>
                        )}
                        <div className="ml-auto relative">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="magnetic rounded-full cursor-pointer text-neutral-400 hover:text-neutral-900 transition-colors p-1"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                            {isMenuOpen && (
                                <div className="menu-dropdown absolute right-0 bottom-full mb-2 bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 w-32">
                                    {user && user.uid === comment.authorId && (
                                        <button 
                                            onClick={() => { handleDelete(); setIsMenuOpen(false); }}
                                            className="magnetic text-[10px] font-black uppercase tracking-widest text-red-600 p-2 cursor-pointer rounded-lg flex items-center gap-2"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => { openReportModal("comment", comment.id); setIsMenuOpen(false); }}
                                        className="magnetic text-[10px] font-black uppercase tracking-widest text-neutral-700 p-2 cursor-pointer  rounded-lg flex items-center gap-2"
                                    >
                                        <Flag size={12} /> Flag
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {isReplying && !isDepthLimitReached && !isCollapsed && (
                        <div ref={replyRef} className="mt-4 flex gap-3 items-end">
                            <textarea 
                                autoFocus
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Append point data..."
                                className="flex-1 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-neutral-900 outline-none resize-none transition-all"
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
            {!isCollapsed && children.length > 0 && (
                <div ref={childrenRef} className="w-full min-w-0">
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
                            openReportModal={openReportModal}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};