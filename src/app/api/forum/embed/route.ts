import { NextResponse } from "next/server";
import { db, firestore } from "@/src/actions/getAdmin";
import { getVector } from "@/src/actions/getVector";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        if (!body) return NextResponse.json({ error: "Malformed payload body" }, { status: 400 });
        const { postId, title, content, tags } = body;

        if (!postId || typeof postId !== "string") return NextResponse.json({ error: "Missing or invalid parameter: postId" }, { status: 400 });
        if (!title || typeof title !== "string") return NextResponse.json({ error: "Missing or invalid parameter: title" }, { status: 400 });
        if (!content || typeof content !== "string") return NextResponse.json({ error: "Missing or invalid parameter: content" }, { status: 400 });
        if (!tags || !Array.isArray(tags)) return NextResponse.json({ error: "Missing or invalid parameter: tags matrix" }, { status: 400 });

        const sanitizedTags = tags.map(t => String(t).trim()).filter(Boolean);
        const vectorInput = `Thread: ${title.trim()}. Content: ${content.trim()}. Topics: ${sanitizedTags.join(", ")}`;
        const vectorValues = await getVector(vectorInput);
        
        if (!vectorValues || !Array.isArray(vectorValues) || vectorValues.length === 0) {
            return NextResponse.json({ error: "Vector provider returned an invalid array geometry" }, { status: 502 });
        }
        const postRef = db.collection("posts").doc(postId);
        await postRef.set({
            embedding: firestore.FieldValue.vector(vectorValues),
            updatedAt: firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return NextResponse.json({ 
            success: true, 
            dimensions: vectorValues.length 
        }, { status: 200 });

    } catch (error) {
        console.error("Critical Vector Indexing Error [API]:", error);
        return NextResponse.json(
            { error: "Internal processing fault during semantic vector mutation" }, 
            { status: 500 }
        );
    }
}