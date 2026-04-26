import { Timestamp } from "firebase/firestore";

export type UserRole = "student" | "consultant" | "admin";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: UserRole;
    
    metadata: {
        currentSchool?: string;
        targetProgram?: string;
        location: string;
    };

    stats: {
        karma: number;
        postCount: number;
        commentCount: number;
        solvedCount: number;
    };

    savedUniversities: string[];
    followedTags: string[];
    
    createdAt: Timestamp;
    lastActive: Timestamp;
}