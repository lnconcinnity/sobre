/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVector } from "../../../../actions/getVector";
import { db } from "../../../../actions/getAdmin";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userQuery = searchParams.get("q");

    if (!userQuery) return Response.json({ error: "Missing query" }, { status: 400 });

    try {
        const queryVector = await getVector(userQuery);
        const collectionRef = db.collection("scholarships");

        const snapshot = await collectionRef.findNearest({
            vectorField: "embedding",
            queryVector: queryVector,
            distanceMeasure: "COSINE",
            limit: 4,
        }).get();

        const results = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            delete data.embedding;
            return {
                id: doc.id,
                ...data,
            };
        });

        return Response.json({ results });

    } catch (error) {
        console.error("Scholarship Search Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}