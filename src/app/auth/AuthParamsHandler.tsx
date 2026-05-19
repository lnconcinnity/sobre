"use client";

import { useSearchParams } from "next/navigation";
import AuthContent from "./AuthContent";

export default function AuthParamsHandler() {
    const params = useSearchParams();
    const redirectPath = params.get("redirect");
    return <AuthContent redirectPath={redirectPath} />;
}