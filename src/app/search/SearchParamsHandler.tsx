"use client";
import { useSearchParams } from "next/navigation";

export default function SearchParamsHandler({ children }: { children: (query: string | null) => React.ReactNode }) {
    const params = useSearchParams();
    const query = params.get("q");
    return <>{children(query)}</>;
}