import { db, firestore } from "@/src/actions/getAdmin";
import { getVector } from "@/src/actions/getVector";

export async function POST(req: Request) {
    try {
        const { postId, title, content, tags } = await req.json();
        const vectorInput = `Thread: ${title}. Content: ${content}. Topics: ${tags.join(", ")}`;
        const vectorValues = await getVector(vectorInput);
        const postRef = db.collection("posts").doc(postId);
        await postRef.update({
            embedding: firestore.FieldValue.vector(vectorValues)
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error("Vector Indexing Error:", error);
        return Response.json({ error: "Failed to embed post" }, { status: 500 });
    }
}