import { Timestamp } from "firebase/firestore";

export type UserRole = "guest" | "partner" | "admin";

export type UserPrivilege = 
    // Guest Core Privileges
    | "forum:create"
    | "forum:reply"
    | "chat:converse"
    // Partner Elevators
    | "blog:write"
    | "institution:update"
    | "analytics:view"
    // Admin Override
    | "system:moderate"
    | "system:manage"; // allows managing users (explicitly grant/revoke privileges), threads/blogs/posts/comments, and site-wide settings

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: UserRole;
    privileges: UserPrivilege[];
    
    metadata: {
        currentSchool?: string;
        targetPrograms?: string[];
        location: string;
        academicYear?: string;
        biography?: string;
    };

    stats: {
        karma: number;
        postCount: number;
        commentCount: number;
    };

    savedUniversities: string[];
    savedScholarships: string[];
    followedTags: string[];

    // TODO: Implement a messenger-like chat schema to track conversations and support
    // interactions, which agent is currently talking, is it solved, etc
    
    createdAt: Timestamp;
    lastActive: Timestamp;
}