import { createContext, useContext } from "react";

export type ToastType = "info" | "warning" | "error" | "success";
export type ToastContextType = {
    toast: (message: string, type?: ToastType) => void,
    info: (message: string) => void,
    warning: (message: string) => void,
    error: (message: string) => void,
    success: (message: string) => void,
    confirm: (message: string) => Promise<boolean>,
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast() can only be called inside a ToastProvider tree.");
    return context;
}