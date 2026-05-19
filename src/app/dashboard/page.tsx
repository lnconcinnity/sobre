/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PrivilegeGuard from "@/src/components/PrivilegeGuard";
import { useAuth } from "@/src/hooks/useAuth";
import { 
    Award, Layers, GraduationCap, 
    MapPin, BookOpen, Clock, Settings 
} from "lucide-react";
import DashboardCard from "./DashboardCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTransition } from "@/src/hooks/useTransition";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import ThreadItem from "@/src/components/ThreadItem";
import SavedUniversityItem from "./SavedUniversityItem";

export default function DashboardPage() {
    const { user } = useAuth();
    const { startTransition } = useTransition();
    const [threads, setThreads] = useState<any[]>([]);
    const [savedUniData, setSavedUniData] = useState<any[]>([]);
    
    useEffect(() => {
        if (!user) return;
        
        const q = query(
            collection(db, "posts"), 
            where("authorId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setThreads(data);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (!user?.savedUniversities?.length) return;

        const fetchUniDetails = async () => {
            const q = query(
                collection(db, "universities"), 
                where("name", "in", user.savedUniversities.slice(0, 10))
            );
            const snap = await getDocs(q);
            setSavedUniData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        };
        fetchUniDetails();
    }, [user?.savedUniversities]);

    if (!user) return null;
    return (
        <PrivilegeGuard>
            <main className="min-h-screen bg-neutral-50 pt-32 pb-24 px-6 md:px-12">
                <div className="max-w-6xl mx-auto space-y-12">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-neutral-900">Workspace</h1>
                            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1">
                                {user.role.toUpperCase()} LEVEL ACCESS ● {user.email}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { label: "Karma", val: user.stats.karma, icon: Award },
                                { label: "Posts", val: user.stats.postCount, icon: BookOpen },
                                { label: "Comments", val: user.stats.commentCount, icon: Layers },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white px-5 py-3 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3">
                                    <stat.icon size={16} className="text-mint-dark" />
                                    <div>
                                        <div className="text-[9px] font-black uppercase text-neutral-400">{stat.label}</div>
                                        <div className="text-sm font-black">{stat.val}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </header>

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xs">
                                <div className="relative size-20 bg-neutral-900 rounded-full mb-6 overflow-hidden">
                                    <Image src={user.photoURL} alt={user.displayName} fill className="object-cover object-center" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">{user.displayName}</h2>
                                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{user.metadata.biography || "No biography provided."}</p>
                                
                                <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                                        <MapPin size={14} /> {user.metadata.location || "Location unset"}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                                        <GraduationCap size={14} /> {user.metadata.academicYear || "Year unset"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DashboardCard title="Saved Universities" count={user.savedUniversities.length}>
                                <div className="flex flex-col gap-3 mt-4">
                                    {savedUniData.map((uni) => (
                                        <SavedUniversityItem key={uni.id} university={uni} />
                                    ))}
                                    {savedUniData.length === 0 && (
                                        <p className="text-xs font-bold text-neutral-400 italic py-4">No data indexed.</p>
                                    )}
                                </div>
                            </DashboardCard>
                            <DashboardCard title="Target Programs" count={user.metadata.targetPrograms?.length || 0}>
                                {user.metadata.targetPrograms?.slice(0, 3).map(prog => (
                                    <div key={prog} className="text-xs font-bold py-2 border-b border-neutral-50">{prog}</div>
                                ))}
                            </DashboardCard>
                        </div>
                    </section>
                    {threads.length > 0 ? (
                        <section className="w-full mt-8 border-t border-neutral-100">
                            <div className="flex flex-col items-center text-center mb-12">
                                <span className="px-2.5 py-1 bg-neutral-950 text-white rounded-md text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                                    Archive Intelligence
                                </span>
                                <h2 className="text-3xl font-black text-neutral-950 uppercase tracking-tighter sm:text-4xl">
                                    Your Contributed Threads
                                </h2>
                                <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 font-semibold uppercase tracking-wider max-w-md">
                                    Tracking all historical contributions and engagement metrics within the forum
                                </p>
                            </div>
                            <div className="max-w-4xl mx-auto space-y-3.5">
                                {threads.map((thread: any) => (
                                    <ThreadItem key={thread.id} thread={thread} />
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="w-full mt-24 text-center py-16 border border-dashed border-neutral-200 rounded-3xl">
                            <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">No active contributions recorded.</p>
                            <button 
                                onClick={() => startTransition("/forum/create")} 
                                className="mt-4 text-[9px] font-black uppercase text-mint-dark underline"
                            >
                                Start your first thread
                            </button>
                        </section>
                    )}
                </div>
            </main>
        </PrivilegeGuard>
    );
}