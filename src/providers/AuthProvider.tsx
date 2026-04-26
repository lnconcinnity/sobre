/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { 
    onAuthStateChanged, 
    User as FirebaseUser 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../modules/firebase";
import { UserProfile } from "../types/userSchema";
import { AuthContext } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
            setFirebaseUser(fUser);

            if (fUser) {
                const userRef = doc(db, "users", fUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserProfile(userSnap.data() as UserProfile);
                } else {
                    const newUser: UserProfile = {
                        uid: fUser.uid,
                        email: fUser.email || "",
                        displayName: fUser.displayName || "Anonymous Scholar",
                        photoURL: fUser.photoURL || "",
                        role: "student",
                        metadata: {
                            location: "Unknown",
                        },
                        stats: {
                            karma: 0,
                            postCount: 0,
                            commentCount: 0,
                            solvedCount: 0,
                        },
                        savedUniversities: [],
                        followedTags: [],
                        createdAt: serverTimestamp() as any,
                        lastActive: serverTimestamp() as any,
                    };

                    await setDoc(userRef, newUser);
                    setUserProfile(newUser);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user: userProfile, loading, firebaseUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
