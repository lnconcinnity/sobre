// src/hooks/useFavorite.ts
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/src/modules/firebase";
import { useAuth } from "./useAuth";

export const useFavorite = () => {
    const { user } = useAuth();
    const toggleFavorite = async (field: "savedUniversities" | "savedScholarships" | "targetPrograms", id: string) => {
        if (!user) return;
        const isSaved = field === "targetPrograms" ? user.metadata.targetPrograms?.includes(id) : user[field].includes(id);
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            [field]: isSaved ? arrayRemove(id) : arrayUnion(id)
        });
    };

    return { toggleFavorite };
};