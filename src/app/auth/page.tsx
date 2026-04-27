"use client";
import { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth } from "@/src/modules/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useTransition } from "@/src/hooks/useTransition";

export default function AuthPage() {
    const { user, loading } = useAuth();
    const { startTransition } = useTransition();

    useEffect(() => {
        if (!loading && user) {
            startTransition("/forum");
        }
    }, [user, loading, startTransition]);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        
        try {
            await signInWithPopup(auth, provider);
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
                try {
                    await signInWithRedirect(auth, provider);
                } catch (redirectError) {
                    console.error("Total Auth Failure:", redirectError);
                }
            } else {
                console.error("Authentication Error:", error.code);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <div className="hidden md:flex md:w-1/2 bg-[#263127] relative p-16 flex-col justify-between overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-10 pointer-events-none">
                    <h1 className="text-[40vw] font-black text-white leading-none uppercase">SOBRE</h1>
                </div>
                
                <button 
                    onClick={() => startTransition("/forum")}
                    className="magnetic max-w-40 cursor-pointer relative z-10 flex items-center gap-2 text-mint-light/50 hover:text-mint-light transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                    <ArrowLeft size={14} /> Back to browsing
                </button>

                <div className="relative z-10">
                    <div className="size-16 relative mb-8">
                        <Image src="/favicon.ico" alt="Logo" fill />
                    </div>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                        Secure Access to <br /> 
                        <span className="text-mint-light">The Collective.</span>
                    </h2>
                    <p className="text-white/40 text-sm font-medium max-w-sm leading-relaxed">
                        Join 12,000+ scholars optimizing their academic trajectory. Your data is encrypted and used solely for institutional matching.
                    </p>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/5">
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
                        Sobre Consultancy Group © 2026
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 relative">
                <div className="md:hidden mb-12 text-center">
                    <span className="font-black uppercase tracking-tighter text-2xl text-black">Sobre</span>
                </div>

                <div className="w-full max-w-sm space-y-10">
                    <div className="space-y-2">
                        <div className="size-10 bg-neutral-50 rounded-xl flex items-center justify-center mb-6 border border-neutral-100">
                            <ShieldCheck size={20} className="text-black" />
                        </div>
                        <h3 className="text-3xl font-black text-black uppercase tracking-tight">Identity Verification</h3>
                        <p className="text-neutral-400 text-sm font-medium">Please sign in to proceed to the forum.</p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={handleGoogleLogin}
                            className="magnetic cursor-pointer w-full flex items-center justify-center gap-4 py-4 px-6 bg-white border-2 border-neutral-100 rounded-2xl hover:border-black transition-colors group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.32-2.06 4.44-1.14 1.14-2.9 2.38-5.78 2.38-4.66 0-8.28-3.76-8.28-8.42s3.62-8.42 8.28-8.42c2.51 0 4.43.98 5.78 2.3l2.32-2.32C18.6 2.36 15.93 1 12.48 1 6.58 1 1.81 5.77 1.81 11.67s4.77 10.67 10.67 10.67c3.23 0 5.67-1.07 7.56-3.07 1.98-1.98 2.6-4.76 2.6-7.35 0-.7-.04-1.37-.16-1.98h-10z"/>
                            </svg>
                            <span className="text-[11px] font-black uppercase tracking-widest text-black">
                                Continue with Google
                            </span>
                        </button>
                        <p className="text-[10px] text-neutral-500 text-center font-medium leading-relaxed">
                            By authenticating, you agree to our <span className="text-black underline cursor-pointer">Terms of Service</span> and <span className="text-black underline cursor-pointer">Privacy Protocol</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}