"use client";
import { useSearchParams } from "next/navigation";

export default function PostDetailsParamsHandler({ children }: { children: (isRedirected: boolean) => React.ReactNode }) {
    const params = useSearchParams();
    const isRedirected = params.get("redirected") === "true";
    return <>{children(isRedirected)}</>;
}