import { createContext, useContext } from "react";

export interface TransitionContextProps {
    startTransition: (href: string) => void,
    totalDuration: number,
}
export const TransitionContext = createContext<TransitionContextProps | null>(null);
export const useTransition = () => {
    const context = useContext(TransitionContext);
    if (!context) throw new Error("useTransition() can only be called inside a TransitionProvider tree.");
    return context;
}