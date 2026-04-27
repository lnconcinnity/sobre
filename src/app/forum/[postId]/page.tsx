/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { ArrowLeft, Send, Globe, MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTransition } from "@/src/hooks/useTransition";

const VoteSideview = ({karma, handleVote, userVote}: any) => (
    <div className="flex flex-col items-center gap-1">
        <button onClick={() => handleVote(1)} className={`${userVote === 1 ? 'text-mint-dark' : 'text-neutral-500'} rounded-full cursor-pointer magnetic hover:text-mint-dark transition-colors`}>
            <ChevronUp size={16} fill={userVote === 1 ? "currentColor" : "transparent"} />
        </button>
        <span className="text-[10px] font-black text-neutral-600">{karma || 0}</span>
        <button onClick={() => handleVote(-1)} className={`${userVote === -1 ? 'text-red-500' : 'text-neutral-500'} rounded-full cursor-pointer magnetic hover:text-red-500 transition-colors`}>
            <ChevronDown size={16} fill={userVote === -1 ? "currentColor" : "transparent"} />
        </button>
    </div>
)

const CommentNode = ({ comment, allComments, onReply, user, postId, allVotes = {} }: any) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    
    const children = allComments.filter((c: any) => c.parentId === comment.id);
    const currentUserVote = allVotes[comment.id] || 0;

    const handleCommentVote = async (targetValue: number) => {
        if (!user) return;
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
        <div className={`mt-6 ${comment.depth > 0 ? "ml-6 md:ml-12 border-l-2 border-neutral-100 pl-6" : ""}`}>
            <div className="flex gap-4 group">
                <div className="relative size-8 rounded-full bg-neutral-200 shrink-0 overflow-hidden">
                    {comment.authorPhoto && <Image src={comment.authorPhoto} alt="" fill className="object-cover" />}
                </div>
                <VoteSideview handleVote={handleCommentVote} karma={comment.karma} userVote={currentUserVote} />
                <div className="flex-1">
                    <div className="bg-white border border-neutral-100 p-6 rounded-3xl rounded-tl-none shadow-sm group-hover:border-neutral-300 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black uppercase tracking-widest">{comment.authorName}</p>
                            <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-tighter">
                                {comment.createdAt ? "Synced" : "Sending..."}
                            </span>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed">{comment.text}</p>
                    </div>
                    <div className="flex gap-4 mt-2 ml-2">
                        <button 
                            onClick={() => setIsReplying(!isReplying)}
                            className="magnetic cursor-pointer text-[9px] font-black uppercase tracking-widest text-neutral-700 hover:text-black transition-colors flex items-center gap-1"
                        >
                            <MessageSquare size={10} /> {isReplying ? "Cancel" : "Reply"}
                        </button>
                    </div>
                    {isReplying && (
                        <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <textarea 
                                autoFocus
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 p-4 bg-neutral-100 border-none rounded-2xl text-xs font-medium focus:ring-1 focus:ring-black outline-none resize-none"
                                rows={2}
                            />
                            <button 
                                onClick={() => {
                                    onReply(replyText, comment.id, comment.depth + 1);
                                    setReplyText("");
                                    setIsReplying(false);
                                }}
                                className="bg-black text-white p-4 rounded-2xl hover:bg-mint-dark transition-colors self-end"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {children.map((child: any) => (
                <CommentNode key={child.id} comment={child} allComments={allComments} onReply={onReply} user={user} postId={postId} allVotes={allVotes} />
            ))}
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

    const submitComment = async (text: string, parentId: string | null = null, depth: number = 0) => {
        if (!user || !text.trim()) return;

        try {
            await addDoc(collection(db, "posts", postId as string, "comments"), {
                text,
                parentId,
                depth,
                authorId: user.uid,
                authorName: user.displayName,
                authorPhoto: user.photoURL,
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
        if (!user) return;

        const voteRef = doc(db, "posts", postId as string, "votes", user.uid);
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
        <div className="min-h-screen bg-neutral-50 pt-32 pb-24 px-8 md:px-16">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => startTransition("/forum")} className="cursor-pointer magnetic flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-12">
                    <ArrowLeft size={14} /> Back to archives
                </button>
                
                <article className="bg-white border border-neutral-100 rounded-[48px] p-12 mb-12 shadow-sm">
                    <div className="flex gap-2 mb-6">
                        {post.tags?.map((tag: string) => (
                            <span key={tag} className="text-[8px] font-black text-mint-dark bg-mint-light/10 px-2 py-1 rounded-md uppercase">#{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-4xl font-black text-black uppercase tracking-tight mb-6">{post.title}</h1>
                    <p className="text-neutral-600 leading-relaxed mb-8 whitespace-pre-wrap font-medium">{post.content}</p>
                    
                    <div className="pt-8 border-t border-neutral-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <VoteSideview handleVote={handlePostVote} karma={post.karma} userVote={userVote} />
                            <div className="relative size-10 rounded-full bg-neutral-100 overflow-hidden shrink-0">
                                <Image src={post.authorPhoto} alt="" fill className="object-cover" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase">{post.authorName}</p>
                                <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">Post Author</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-300">
                           <Globe size={14}/>
                           <span className="text-[10px] font-bold uppercase tracking-widest">Public Archive</span>
                        </div>
                    </div>
                </article>

                <section className="space-y-8">
                    <div className="flex items-center justify-between ml-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">
                            Discussion ({comments.length})
                        </h4>
                    </div>
                    <div className="space-y-4">
                        {rootComments.map((comment) => (
                            <CommentNode 
                                key={comment.id} 
                                comment={comment} 
                                allComments={comments} 
                                onReply={submitComment} 
                                user={user}
                                postId={postId}
                                allVotes={commentVotes}
                            />
                        ))}
                    </div>
                    {user ? (
                        <div className="mt-20 pt-12 border-t border-neutral-200">
                             <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-6 block mb-4">Start a new thread</label>
                             <div className="relative">
                                <textarea 
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    placeholder="Add to the collective intelligence..."
                                    className="w-full p-8 bg-white border border-neutral-100 rounded-4xl focus:border-black focus:outline-none text-sm font-medium shadow-sm transition-all"
                                    rows={3}
                                />
                                <button 
                                    onClick={() => {
                                        submitComment(commentInput);
                                        setCommentInput("");
                                    }}
                                    className="magnetic absolute bottom-4 right-4 p-4 bg-black text-white rounded-2xl hover:bg-mint-dark transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                             </div>
                        </div>
                    ) : (
                        <div className="p-8 bg-neutral-100 rounded-4xl text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Authentication required to engage</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}