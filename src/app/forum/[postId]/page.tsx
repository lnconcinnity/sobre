"use server";

import PostDetailsParamsHandler from "./PostDetailsParamsHandler";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export default async function PostDetailsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#263127] flex items-center justify-center text-white/50">
                <Loader className="animate-spin text-mint-light" size={32} />
            </div>
        }>
            <PostDetailsParamsHandler />
        </Suspense>
    );
}