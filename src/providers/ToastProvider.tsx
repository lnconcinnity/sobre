/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState, useRef, useMemo, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ToastContext, type ToastType } from "../hooks/useToast";
import { X } from "lucide-react";

const ConfirmModal = ({ message, onResult }: { message: string, onResult: (val: boolean) => void }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    useGSAP(() => {
        gsap.fromTo(modalRef.current, 
            { opacity: 0, y: 10, scale: 0.98 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" }
        );
    }, []);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-neutral-950/40 backdrop-blur-sm p-4">
            <div ref={modalRef} className="w-full max-w-xs bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
                <p className="text-neutral-900 text-xs font-semibold leading-relaxed tracking-tight">
                    {message}
                </p>
                <div className="flex gap-3">
                    <button onClick={() => onResult(false)} className="magnetic cursor-pointer flex-1 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => onResult(true)} className="magnetic cursor-pointer flex-1 py-3 px-4 bg-neutral-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const ToastItem = ({ id, message, type, onDismiss }: any & { onDismiss: (id: number) => void }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        gsap.set(progressRef.current, { width: "100%" }); 
        tl.fromTo(elementRef.current, 
            { x: 50, opacity: 0, scale: 0.95 }, 
            { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
        )
        .to(progressRef.current, { width: "0%", duration: 5, ease: "none" }) // This now animates 100% -> 0%
        .to(elementRef.current, { opacity: 0, x: 20, duration: 0.2, ease: "power2.in", onComplete: () => onDismiss(id) });
    }, { scope: elementRef });

    const getTheme = () => {
        switch (type) {
            case "success": return "border-mint-default text-mint-dark bg-white";
            case "error": return "border-red-500 text-red-900 bg-white";
            case "warning": return "border-yellow-500 text-yellow-900 bg-white";
            default: return "border-neutral-200 text-neutral-900 bg-white";
        }
    };

    return (
        <div 
            ref={elementRef}
            className={`relative mb-3 border bg-white shadow-xl rounded-2xl p-4 min-w-280px overflow-hidden ${getTheme()}`}
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                    {type === 'info' ? 'System Notification' : type}
                </span>
                <button onClick={() => onDismiss(id)} className="magnetic text-neutral-400 hover:text-neutral-900 transition-colors rounded-full pointer-events-auto cursor-pointer">
                    <X size={12} strokeWidth={3} />
                </button>
            </div>
            <p className="text-[11px] font-medium leading-relaxed tracking-tight text-neutral-600">
                {message}
            </p>
            <div className="absolute bottom-1 left-0 h-0.5 w-full bg-neutral-100">
                <div 
                    ref={progressRef}
                    className={`h-full ${type === 'success' ? 'bg-mint-default' : type === 'error' ? 'bg-red-500' : 'bg-neutral-900'}`}
                />
            </div>
        </div>
    );
};

export default function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<any[]>([]);
    const [confirmState, setConfirmState] = useState<{message: string, resolve: (val: boolean) => void} | null>(null);

    const toast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const confirm = useCallback((message: string): Promise<boolean> => {
        return new Promise((resolve) => setConfirmState({ message, resolve }));
    }, []);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const contextValue = useMemo(() => ({
        toast,
        info: (msg: string) => toast(msg, "info"),
        warning: (msg: string) => toast(msg, "warning"),
        error: (msg: string) => toast(msg, "error"),
        success: (msg: string) => toast(msg, "success"),
        confirm
    }), [toast, confirm]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {confirmState && (
                <ConfirmModal 
                    message={confirmState.message} 
                    onResult={(val) => { confirmState.resolve(val); setConfirmState(null); }} 
                />
            )}
            <div className="fixed bottom-6 right-6 top-6 z-100 flex flex-col items-end pointer-events-none">
                {toasts.map((t) => <ToastItem key={t.id} {...t} onDismiss={dismiss} />)}
            </div>
        </ToastContext.Provider>
    );
}