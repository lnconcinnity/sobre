"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShieldAlert } from "lucide-react";
import gsap, { ScrollSmoother } from "@/src/modules/gsap"; // Adjust import path to your local GSAP register instance

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string, details: string) => void;
    targetType: "post" | "comment";
}

export default function ReportModal({ isOpen, onClose, onSubmit, targetType }: ReportModalProps) {
    const [reason, setReason] = useState("spam");
    const [details, setDetails] = useState("");
    const [mounted, setMounted] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isOpen && modalRef.current) {
            gsap.fromTo(modalRef.current, 
                { opacity: 0, scale: 0.95, y: 20 }, 
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );
        }
    }, [isOpen]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        const smoother = ScrollSmoother.get();
        if (smoother) {
            smoother.paused(true);
        }
        return () => {
            document.body.style.overflow = "auto";
            if (smoother) {
                smoother.paused(false);
            }
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs overscroll-contain">
            <div ref={modalRef} className="bg-white border border-neutral-900 w-full max-w-md rounded-4xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-500">
                        <ShieldAlert size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Flag Content Node</h3>
                    </div>
                    <button onClick={onClose} className="magnetic text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer">
                        <X size={16} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Infraction Classification</label>
                        <select 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            className="cursor-pointer locked w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider outline-none focus:border-neutral-900"
                        >
                            <option value="spam">Spam</option>
                            <option value="harassment">Harassment</option>
                            <option value="misleading">Misleading Content or Information</option>
                            <option value="advertising">Advertising / Soliciting</option>
                            <option value="off-topic">Off-Topic</option>
                            <option value="inappropriate">Inappropriate or Offensive Material</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Telemetry / Additional Details</label>
                        <textarea 
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Provide descriptive log indicators explaining why this content requires structural pruning..."
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-neutral-900 outline-none resize-none h-24"
                        />
                    </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={onClose}
                        className="magnetic flex-1 py-3 border border-neutral-200 rounded-xl font-bold uppercase tracking-widest text-[9px] text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            onSubmit(reason, details);
                            setDetails("");
                            onClose();
                        }}
                        className="magnetic flex-1 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-colors cursor-pointer shadow-md shadow-red-500/10"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}