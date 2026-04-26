import { Timestamp } from "firebase/firestore";
import { UserRole } from "./userSchema";

export type PostCategory = "admission" | "commute" | "academics" | "lifestyle" | "scholarship";

export interface Post {
    id: string;
    slug: string;
    title: string;
    content: string;
    category: PostCategory;
    tags: string[];

    author: {
        uid: string;
        displayName: string;
        photoURL: string;
        role: UserRole;
    };

    metrics: {
        upvotes: number;
        downvotes: number;
        viewCount: number;
        commentCount: number;
    };

    flags: {
        isLocked: boolean;
        isPinned: boolean;
        isResolved: boolean;
    };

    createdAt: Timestamp;
    updatedAt: Timestamp;
}