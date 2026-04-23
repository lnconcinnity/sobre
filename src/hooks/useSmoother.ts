"use client";

import { createContext, useContext } from "react";
import { ScrollSmoother } from "../modules/gsap";

export const SmoothContext = createContext<ScrollSmoother | null>(null);
export default function useSmoother() {
    const smoother = useContext(SmoothContext);
    return smoother;
}