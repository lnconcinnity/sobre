"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader2, ShieldX, ArrowLeft, Lock } from "lucide-react";
import { UserPrivilege } from "../types/userSchema";
import { useTransition } from "@/src/hooks/useTransition";

interface PrivilegeGuardProps {
    children: React.ReactNode;
    requiredPrivilege?: UserPrivilege;
}

export default function PrivilegeGuard({ children, requiredPrivilege }: PrivilegeGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { startTransition } = useTransition();
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            startTransition(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        if (requiredPrivilege && !user.privileges?.includes(requiredPrivilege)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsUnauthorized(true);
        } else {
            setIsUnauthorized(false);
        }
    }, [user, loading, pathname, startTransition, requiredPrivilege, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#263127] flex flex-col items-center justify-center text-white/50 select-none">
                <Loader2 className="animate-spin text-mint-light mb-4" size={24} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-mint-light/70 animate-pulse">
                    Verifying Workspace Clearances...
                </span>
            </div>
        );
    }

    if (isUnauthorized) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center select-none">
                <div className="w-full max-w-sm space-y-6 flex flex-col items-center">
                    <div className="size-14 bg-red-50 border border-red-200 text-red-500 rounded-2xl flex items-center justify-center relative group">
                        <Lock size={20} className="absolute group-hover:opacity-0 transition-opacity duration-200" />
                        <ShieldX size={20} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Access Restricted</h3>
                        <p className="text-neutral-400 text-xs font-medium leading-relaxed max-w-xs">
                            Your authenticated user node lacks the <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800 font-mono text-[10px] font-bold">{requiredPrivilege}</code> privilege assignment required to inspect this clearance sector.
                        </p>
                    </div>

                    <button 
                        onClick={() => startTransition()}
                        className="magnetic flex items-center justify-center gap-2 px-5 py-3 border border-neutral-200 hover:border-neutral-900 text-neutral-500 hover:text-neutral-900 bg-white transition-all rounded-xl font-bold uppercase tracking-widest text-[9px] cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                        <ArrowLeft size={12} /> Return to Public Space
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}