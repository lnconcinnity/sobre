"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { useToast } from "@/src/hooks/useToast";
import { X, Camera, GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileEditModal({ onClose, currentData }: { onClose: () => void, currentData: any }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        displayName: currentData.displayName || "",
        biography: currentData.metadata?.biography || "",
        location: currentData.metadata?.location || "",
        academicYear: currentData.metadata?.academicYear || ""
    });
    const [previewUrl, setPreviewUrl] = useState(currentData.photoURL);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);
    const { error: err } = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            let photoURL = currentData.photoURL;

            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("userId", user.uid);
                const res = await fetch("/api/user/update-profile-picture", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                photoURL = data.url;
            }

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                "metadata.biography": formData.biography,
                "metadata.location": formData.location,
                "metadata.academicYear": formData.academicYear,
                photoURL: photoURL
            });
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            err("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-100 relative">
                <button onClick={onClose} className="magnetic cursor-pointer rounded-full absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"><X size={20} /></button>
                
                <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Edit Profile</h3>
                
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative size-20 rounded-full overflow-hidden bg-neutral-100 border-2 border-neutral-200">
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="locked magnetic cursor-pointer rounded-full absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                        >
                            <Camera size={24} />
                        </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <div className="text-xs font-bold text-neutral-500">Click avatar to change<br/>or upload new photo</div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-neutral-400">Display Name</label>
                        <input value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})} className="w-full mt-1 px-4 py-3 bg-neutral-50 rounded-xl border text-sm font-bold focus:ring-2 focus:ring-mint-dark outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-1.5 ml-1">
                                <MapPin size={10} className="text-mint-dark" /> Location
                            </label>
                            <input 
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                placeholder="City, Country"
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-bold text-neutral-900 focus:border-neutral-950 focus:bg-white outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-1.5 ml-1">
                                <GraduationCap size={10} className="text-mint-dark" /> Academic Year
                            </label>
                            <input 
                                value={formData.academicYear}
                                onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                                placeholder="e.g. 2026"
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-bold text-neutral-900 focus:border-neutral-950 focus:bg-white outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-neutral-400">Biography</label>
                        <textarea rows={3} value={formData.biography} onChange={(e) => setFormData({...formData, biography: e.target.value})} className="w-full mt-1 px-4 py-3 bg-neutral-50 rounded-xl border text-sm font-bold focus:ring-2 focus:ring-mint-dark outline-none resize-none" />
                    </div>
                </div>

                <button onClick={handleSave} disabled={loading} className="magnetic w-full mt-8 py-3 bg-neutral-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer">
                    {loading ? "SAVING..." : "SAVE CHANGES"}
                </button>
            </div>
        </div>,
        document.body
    );
}