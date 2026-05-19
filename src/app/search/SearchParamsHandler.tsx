"use client";
import { useSearchParams } from "next/navigation";
import SearchContent from "./SearchContent";

export default function SearchParamsHandler() {
    const params = useSearchParams();
    const query = params.get("q");
    return <SearchContent query={query} />;
}