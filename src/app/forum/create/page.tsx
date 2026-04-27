"use client";
import { useState } from "react";
import { useTransition } from "@/src/hooks/useTransition";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { ArrowLeft, Send, Info } from "lucide-react";

export default function CreatePostPage() {
    const { user } = useAuth();
    const { startTransition } = useTransition();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: "", content: "", tags: "" });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!user || !form.title || !form.content) return;

        setLoading(true);
        try {
            const tagsArray = form.tags.split(",").map(t => t.trim().replace("#", "")).filter(t => t !== "");
            
            const docRef = await addDoc(collection(db, "posts"), {
                title: form.title,
                content: form.content,
                tags: tagsArray,
                authorId: user.uid,
                authorName: user.displayName,
                authorPhoto: user.photoURL,
                karma: 0,
                replies: 0,
                createdAt: serverTimestamp(),
            });

            fetch("/api/forum/embed", {
                method: "POST",
                body: JSON.stringify({
                    postId: docRef.id,
                    title: form.title,
                    content: form.content,
                    tags: tagsArray
                })
            });

            startTransition(`/forum/${docRef.id}`);
        } catch (err) {
            console.error("Failed to post:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 pt-32 pb-24 px-8 md:px-16">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => startTransition("/forum")}
                    className="magnetic cursor-pointer flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mb-12"
                >
                    <ArrowLeft size={14} /> Back to Forum
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <h1 className="text-5xl font-black text-black uppercase tracking-tighter mb-8">
                            New <span className="text-mint-dark">Discussion.</span>
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-mint-dark ml-2">Thread Title</label>
                                <input 
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({...form, title: e.target.value})}
                                    placeholder="e.g., How to ace the USTET without losing sleep?"
                                    className="w-full text-2xl font-bold bg-transparent border-b-2 border-neutral-200 focus:border-black focus:outline-none py-4 transition-all placeholder:text-neutral-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-mint-dark ml-2">Context / Content</label>
                                <textarea 
                                    required
                                    rows={10}
                                    value={form.content}
                                    onChange={(e) => setForm({...form, content: e.target.value})}
                                    placeholder="Share your experience or ask your question..."
                                    className="w-full p-8 bg-white border border-neutral-100 rounded-4xl focus:border-black focus:outline-none text-sm font-medium leading-relaxed transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-mint-dark ml-2">Tags (Comma separated)</label>
                                <input 
                                    value={form.tags}
                                    onChange={(e) => setForm({...form, tags: e.target.value})}
                                    placeholder="UPCAT, Advice, Engineering"
                                    className="w-full px-6 py-4 bg-white border border-neutral-100 rounded-2xl focus:border-black focus:outline-none text-xs font-bold uppercase tracking-widest"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="magnetic cursor-pointer w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 hover:bg-mint-dark transition-colors disabled:opacity-50"
                            >
                                {loading ? "Archiving..." : "Publish Discussion"}
                                <Send size={16} />
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-4 pt-16">
                        <div className="p-8 bg-white border border-neutral-100 rounded-[40px] space-y-6 sticky top-32">
                            <div className="flex items-center gap-3 text-mint-dark">
                                <Info size={20} />
                                <h4 className="font-black uppercase text-[10px] tracking-widest">Protocol</h4>
                            </div>
                            <ul className="space-y-4">
                                <li className="text-[11px] font-medium text-neutral-500 leading-snug">
                                    <b className="text-black block mb-1">Be Specific</b>
                                    Detailed questions receive 80% more engagement from our consultants.
                                </li>
                                <li className="text-[11px] font-medium text-neutral-500 leading-snug">
                                    <b className="text-black block mb-1">Tag Accurately</b>
                                    Tags help filter your query into the right academic department.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}