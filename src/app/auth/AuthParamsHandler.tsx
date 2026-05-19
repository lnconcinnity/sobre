"use client";

import { useSearchParams } from "next/navigation";

export default function AuthParamsHandler({ children }: { children: (redirectPath: string | null) => React.ReactNode }) {
    const params = useSearchParams();
    const redirectPath = params.get("redirect");
    return <>{children(redirectPath)}</>;
}