"use client";
import { useSearchParams } from "next/navigation";
import PostDetailsContent from "./PostDetailsContent";

export default function PostDetailsParamsHandler() {
    const params = useSearchParams();
    const isRedirected = params.get("redirected") === "true";
    return <PostDetailsContent isRedirected={isRedirected} />;
}