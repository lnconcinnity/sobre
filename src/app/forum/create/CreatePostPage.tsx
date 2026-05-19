"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useTransition } from "@/src/hooks/useTransition";
import { doc, collection, serverTimestamp, increment, runTransaction } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { ArrowLeft, Send, Sparkles, Info, BookOpen, AlignLeft, X, Edit2, Paperclip } from "lucide-react";
import Image from "next/image";

const MAX_TAGS = 5;

const PILL_PALETTES = [
    { bg: "bg-emerald-50/60", text: "text-emerald-700", border: "border-emerald-200/60" },
    { bg: "bg-blue-50/60", text: "text-blue-700", border: "border-blue-200/60" },
    { bg: "bg-amber-50/60", text: "text-amber-700", border: "border-amber-200/60" },
    { bg: "bg-indigo-50/60", text: "text-indigo-700", border: "border-indigo-200/60" },
    { bg: "bg-rose-50/60", text: "text-rose-700", border: "border-rose-200/60" },
    { bg: "bg-zinc-100/70", text: "text-zinc-700", border: "border-zinc-300/60" },
];

interface TagPill {
    id: string;
    text: string;
    palette: typeof PILL_PALETTES[0];
}

export default function CreatePostPage() {
    const { user } = useAuth();
    const { startTransition } = useTransition();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: "", content: "" });
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tags, setTags] = useState<TagPill[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const tagInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            attachments.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
        };
    }, [attachments]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setAttachments(prev => [...prev, ...files].slice(0, 5));
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeAttachment = (index: number) => {
        const fileToRemove = attachments[index];
        URL.revokeObjectURL(URL.createObjectURL(fileToRemove));
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const cleanText = tagInput.trim().replace(/[#,]/g, "");
            
            if (!cleanText) return;
            
            if (editingId) {
                setTags(tags.map(t => t.id === editingId ? { ...t, text: cleanText } : t));
                setEditingId(null);
            } else {
                if (tags.length >= MAX_TAGS) return;
                const randomPalette = PILL_PALETTES[Math.floor(Math.random() * PILL_PALETTES.length)];
                const newPill: TagPill = {
                    id: Math.random().toString(36).substring(2, 9),
                    text: cleanText,
                    palette: randomPalette
                };
                setTags([...tags, newPill]);
            }
            setTagInput("");
        } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const startTagEdit = (pill: TagPill) => {
        setEditingId(pill.id);
        setTagInput(pill.text);
        tagInputRef.current?.focus();
    };

    const removeTag = (id: string) => {
        setTags(tags.filter(t => t.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setTagInput("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !form.title || !form.content) return;

        setLoading(true);
        try {
            const tagsArray = tags.map(t => t.text.toLowerCase());
            
            const attachmentUrls = await Promise.all(attachments.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", "sobre/uploads");
                const res = await fetch("/api/user/upload-attachment", { method: "POST", body: formData });
                const data = await res.json();
                return data.url;
            }));
            
            await runTransaction(db, async (transaction) => {
                const postRef = doc(collection(db, "posts"));
                const userRef = doc(db, "users", user.uid);
                
                transaction.set(postRef, {
                    title: form.title,
                    content: form.content,
                    tags: tagsArray,
                    authorId: user.uid,
                    authorName: user.displayName,
                    authorPhoto: user.photoURL,
                    attachments: attachmentUrls,
                    karma: 0,
                    replies: 0,
                    createdAt: serverTimestamp(),
                });
                transaction.update(userRef, { 
                    "stats.postCount": increment(1) 
                });
                
                fetch("/api/forum/embed", {
                    method: "POST",
                    body: JSON.stringify({
                        postId: postRef.id,
                        title: form.title,
                        content: form.content,
                        tags: tagsArray
                    })
                });

                startTransition(`/forum/${postRef.id}?redirected=true`);
            });
        } catch (err) {
            console.error("Failed to post:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#fbfdfb] pt-16 sm:pt-24 md:pt-32 pb-8 px-4 sm:px-8 md:px-16 overflow-x-hidden flex flex-col justify-between select-none">
            <div 
                className="absolute inset-0 z-0 bg-architectural-grid bg-size-[4rem_4rem] opacity-40 pointer-events-none" 
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    willChange: "transform",
                    transform: "translateZ(0)"
                }}
            />
            
            <div className="relative z-10 max-w-7xl mx-auto w-full grow flex flex-col justify-center h-full">
                <div className="mb-6 md:mb-8 shrink-0">
                    <button 
                        type="button"
                        onClick={() => startTransition("/forum")}
                        className="magnetic rounded-full cursor-pointer flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
                    >
                        <ArrowLeft size={12} /> 
                        Back to Forum Track
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch grow h-full overflow-hidden">
                    <div className="lg:col-span-8 flex flex-col bg-white border border-neutral-200 rounded-4xl p-6 md:p-8 shadow-sm overflow-y-auto no-scrollbar justify-between gap-6">
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-mint-dark uppercase tracking-[0.3em] block">
                                    Initialize Vector Thread
                                </span>
                                <Sparkles size={12} className="text-mint-dark animate-pulse" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-neutral-900 uppercase tracking-tighter leading-none">
                                New{" "}
                                <span className="text-transparent italic font-serif font-light tracking-wide pl-1" style={{ WebkitTextStroke: "1px #263127" }}>
                                    Discussion.
                                </span>
                            </h1>
                        </div>

                        <div className="space-y-5 grow flex flex-col justify-center">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5 ml-1">
                                    <BookOpen size={10} className="text-mint-dark" />
                                    Thread Title
                                </label>
                                <input 
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({...form, title: e.target.value})}
                                    placeholder="e.g., How to ace the USTET without losing sleep?"
                                    className="locked magnetic w-full text-lg md:text-xl font-bold bg-neutral-50/50 border border-neutral-200 rounded-2xl px-5 py-4 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all duration-200 placeholder:text-neutral-400 text-neutral-900"
                                />
                            </div>
                            <div className="space-y-2 flex flex-col grow">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5 ml-1">
                                    <AlignLeft size={10} className="text-mint-dark" />
                                    Context Parameters
                                </label>
                                <textarea 
                                    required
                                    value={form.content}
                                    onChange={(e) => setForm({...form, content: e.target.value})}
                                    placeholder="Share your technical experience or map out your queries..."
                                    className="locked magnetic w-full p-5 bg-neutral-50/50 border border-neutral-200 rounded-3xl focus:border-neutral-900 focus:bg-white focus:outline-none text-sm font-medium leading-relaxed transition-all duration-200 placeholder:text-neutral-400 text-neutral-800 min-h-35 lg:grow resize-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="magnetic cursor-pointer rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                                    >
                                        <Paperclip size={12} /> Attach Assets
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" multiple />
                                </div>
                                {attachments.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {attachments.map((file, i) => (
                                            <div key={i} className="relative size-16 shrink-0 rounded-lg border border-neutral-200 overflow-hidden">
                                                <Image src={URL.createObjectURL(file)} className="size-full object-cover" fill alt={file.name} />
                                                <button 
                                                    onClick={() => removeAttachment(i)}
                                                    className="magnetic cursor-pointer absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-600"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={`magnetic locked w-full min-h-14 p-2 bg-neutral-50/50 border border-neutral-200 rounded-2xl flex flex-wrap items-center gap-2 focus-within:bg-white focus-within:border-neutral-900 transition-all duration-200 ${tags.length >= MAX_TAGS && !editingId ? "opacity-90 select-none" : ""}`}>
                                {tags.map((pill) => (
                                    <div 
                                        key={pill.id} 
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${pill.palette.bg} ${pill.palette.text} ${pill.palette.border} ${editingId === pill.id ? "ring-2 ring-neutral-900 opacity-60" : ""}`}
                                    >
                                        <span>#{pill.text}</span>
                                        <div className="flex items-center gap-0.5 ml-1 border-l border-neutral-400/20 pl-1.5 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => startTagEdit(pill)}
                                                className="magnetic hover:text-neutral-900 transition-colors p-0.5 rounded cursor-pointer"
                                                title="Edit Tag"
                                            >
                                                <Edit2 size={10} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeTag(pill.id)}
                                                className="magnetic hover:text-red-600 transition-colors p-0.5 rounded cursor-pointer"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <input 
                                    ref={tagInputRef}
                                    type="text"
                                    value={tagInput}
                                    disabled={tags.length >= MAX_TAGS && !editingId}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder={
                                        tags.length === 0 
                                            ? "Press Enter or Comma to map tags (e.g., UPCAT)" 
                                            : tags.length >= MAX_TAGS && !editingId
                                                ? "Index limit reached" 
                                                : "Add more..."
                                    }
                                    className="flex-1 min-w-35 bg-transparent border-0 focus:outline-none focus:ring-0 text-[10px] font-black uppercase tracking-widest text-neutral-800 placeholder:text-neutral-400 disabled:placeholder:text-neutral-400/60 py-1.5 px-2 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-4 h-full justify-between">
                        <div className="p-6 md:p-8 bg-white border border-neutral-200 rounded-4xl space-y-5 shadow-sm">
                            <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-3">
                                <Info size={14} className="text-mint-dark" />
                                <h4 className="font-black uppercase text-[9px] tracking-[0.2em] text-neutral-400">System Protocol</h4>
                            </div>
                            <ul className="space-y-4">
                                <li className="text-[11px] font-medium text-neutral-500 leading-relaxed">
                                    <b className="text-neutral-800 block font-bold text-xs mb-0.5">Be Specific & Objective</b>
                                    Detailed procedural queries receive up to 80% more analytical response activity from senior scholars.
                                </li>
                                <li className="text-[11px] font-medium text-neutral-500 leading-relaxed">
                                    <b className="text-neutral-800 block font-bold text-xs mb-0.5">Categorize Intelligently</b>
                                    Accurate token keywords ensure your thread maps cleanly into corresponding departmental semantic matching views.
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4 w-full">
                            <button 
                                type="submit"
                                disabled={loading || !form.title || !form.content}
                                className="magnetic cursor-pointer w-full py-4.5 bg-neutral-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-mint-dark transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-neutral-900 shadow-md shadow-neutral-950/5"
                            >
                                {loading ? "Archiving Track..." : "Publish Discussion Entry"}
                                <Send size={12} className={loading ? "animate-ping" : ""} />
                            </button>
                            <div className="p-5 bg-neutral-950 rounded-3xl text-white border border-neutral-800 relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 size-20 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-mint-light block mb-1">
                                    Technical Note
                                </span>
                                <p className="text-[10px] font-medium text-neutral-400 leading-normal">
                                    All submitted entries are fed directly through our semantic routing matrix for predictive categorization and discovery indexation.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}