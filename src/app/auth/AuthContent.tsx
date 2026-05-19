"use client";

import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "@/src/modules/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTransition } from "@/src/hooks/useTransition";

export default function AuthContent({ redirectPath }: { redirectPath: string | null }) {
    const { user, loading: authLoading } = useAuth();
    const { startTransition } = useTransition();
    const [localProcessing, setLocalProcessing] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    startTransition(redirectPath as string | undefined);
                }
            })
            .catch((error) => {
                console.error("Redirect Resolution Failure:", error);
                setAuthError("Failed to resolve authentication redirect.");
            });
    }, [startTransition, redirectPath]);

    useEffect(() => {
        if (!authLoading && user) {
            startTransition(redirectPath as string | undefined);
        }
    }, [user, authLoading, startTransition, redirectPath]);

    const handleGoogleLogin = async () => {
        setLocalProcessing(true);
        setAuthError(null);
        const provider = new GoogleAuthProvider();
        
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            const error = err as { code: string; message: string };
            if (
                error.code === 'auth/popup-blocked' || 
                error.code === 'auth/cancelled-popup-request' ||
                error.code === 'auth/popup-closed-by-user'
            ) {
                try {
                    // Fail over cleanly to viewport takeover redirect routines
                    await signInWithRedirect(auth, provider);
                } catch (redirectError) {
                    console.error("Total Auth Failure:", redirectError);
                    setAuthError("System failed to initialize secure authentication redirect.");
                    setLocalProcessing(false);
                }
            } else {
                console.error("Authentication Error:", error.code);
                setAuthError(error.message || "An authentication fault occurred.");
                setLocalProcessing(false);
            }
        }
    };

    if (authLoading || (user && !authLoading)) {
        return (
            <div className="min-h-screen bg-[#263127] flex flex-col items-center justify-center text-white/50">
                <Loader2 className="animate-spin text-mint-light mb-4" size={32} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Restoring Access Token...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
            <div className="hidden md:flex md:w-1/2 bg-[#263127] relative p-16 flex-col justify-between overflow-hidden select-none">
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-[0.03] pointer-events-none tracking-tighter">
                    <h1 className="text-[35vw] font-black text-white leading-none uppercase">SOBRE</h1>
                </div>
                
                <button 
                    onClick={() => startTransition(redirectPath as string | undefined)}
                    className="magnetic rounded-full max-w-40 cursor-pointer relative z-10 flex items-center gap-2 text-mint-light/50 hover:text-mint-light transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                    <ArrowLeft size={14} /> Back to browsing
                </button>

                <div className="relative z-10">
                    <div className="size-12 relative mb-8 rounded-xl overflow-hidden border border-white/10 p-2 bg-white/5">
                        <Image src="/favicon.ico" alt="Logo" fill className="p-2" />
                    </div>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-6">
                        Secure Access to <br /> 
                        <span className="text-transparent italic font-serif font-light pl-1" style={{ WebkitTextStroke: "1px #fbfdfb" }}>The Collective.</span>
                    </h2>
                    <p className="text-white/40 text-xs font-medium max-w-xs leading-relaxed">
                        Join 12,000+ scholars optimizing their academic trajectory. Your data is encrypted and used solely for institutional matching metrics.
                    </p>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/5">
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
                        Sobre Consultancy Group © 2026
                    </p>
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 relative">
                <button 
                    onClick={() => startTransition()}
                    className="md:hidden absolute top-8 left-8 flex items-center gap-2 text-neutral-400 font-bold uppercase text-[9px] tracking-widest"
                >
                    <ArrowLeft size={12} /> Exit Track
                </button>

                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-3">
                        <div className="size-11 bg-neutral-50 rounded-xl flex items-center justify-center mb-6 border border-neutral-200/60 shadow-xs">
                            <ShieldCheck size={20} className="text-neutral-900" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight">Identity Verification</h3>
                        <p className="text-neutral-400 text-xs font-medium leading-relaxed">Please sign in to authenticate your user token profile.</p>
                    </div>

                    <div className="space-y-4">
                        {authError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-bold text-[10px] uppercase tracking-wider">
                                {authError}
                            </div>
                        )}

                        <button 
                            disabled={localProcessing}
                            onClick={handleGoogleLogin}
                            className={`magnetic w-full flex items-center justify-center gap-4 py-4 px-6 bg-white border-2 border-neutral-100 rounded-2xl transition-colors duration-200 group ${
                                localProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-neutral-900 hover:shadow-lg hover:shadow-neutral-100"
                            }`}
                        >
                            {localProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                            ) : (
                                <svg className="w-4 h-4 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.32-2.06 4.44-1.14 1.14-2.9 2.38-5.78 2.38-4.66 0-8.28-3.76-8.28-8.42s3.62-8.42 8.28-8.42c2.51 0 4.43.98 5.78 2.3l2.32-2.32C18.6 2.36 15.93 1 12.48 1 6.58 1 1.81 5.77 1.81 11.67s4.77 10.67 10.67 10.67c3.23 0 5.67-1.07 7.56-3.07 1.98-1.98 2.6-4.76 2.6-7.35 0-.7-.04-1.37-.16-1.98h-10z"/>
                                </svg>
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">
                                {localProcessing ? "Verifying Token..." : "Continue with Google"}
                            </span>
                        </button>
                        
                        <p className="text-[9px] text-neutral-400 text-center font-medium leading-relaxed px-2">
                            By authenticating, you agree to our <span className="magnetic rounded-full text-neutral-900 underline font-bold cursor-pointer hover:text-mint-dark">Terms of Service</span> and secure <span className="magnetic rounded-full text-neutral-900 underline font-bold cursor-pointer hover:text-mint-dark">Privacy Protocol</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}