"use client";

import { Loader } from "lucide-react";
import { Suspense } from "react";
import AuthParamsHandler from "./AuthParamsHandler";

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#263127] flex items-center justify-center text-white/50">
                <Loader className="animate-spin text-mint-light" size={32} />
            </div>
        }>
            <AuthParamsHandler />
        </Suspense>
    );
}