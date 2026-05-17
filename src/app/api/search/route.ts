/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVector } from "../../../actions/getVector";
import { db } from "../../../actions/getAdmin";
import { groq } from "../../../actions/getGroq";

const getSlugFromUserQuery = (text: string) => {
    return text
        .toLowerCase()
        .replace(/\b(bachelor of science)\b/gi, "bs-in")
        .replace(/\b(bachelor of arts|ab)\b/gi, "ba-in")
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userQuery = searchParams.get("q");

    if (!userQuery) return Response.json({ error: "Missing query" }, { status: 400 });
    
    try {
        const intentResponse = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are a search query router. Determine if the user is looking for an academic field/program study details or a university place to enroll.

                    Rules:
                    - Set isProgram to true if seeking info about majors, degrees, curriculum, or subjects.
                    - Set isProgram to false if seeking locations, schools, or university campuses.
                    - Extract programmatic slug candidates if matching a field of study.

                    Return ONLY a JSON object matching this schema. No conversation, no markdown blocks.`
                },
                { role: "user", content: `Query: "${userQuery}"` }
            ],
            temperature: 0,
            model: "qwen/qwen3-32b",
            response_format: { 
                type: "json_object"
            },
        });

        const rawContent = intentResponse.choices[0].message.content || "{}";
        const parsed = JSON.parse(rawContent);
        
        const isProgram = !!parsed.isProgram;
        const slugCandidates = (parsed.slugCandidates || [])
            .map((s: string) => getSlugFromUserQuery(s))
            .filter(Boolean)
            .slice(0, 10);
            
        const queryVector = await getVector(userQuery);
        
        const intent = isProgram ? "programs" : "universities";
        const collectionRef = db.collection(intent);

        let snapshot;
        
        if (isProgram && slugCandidates.length > 0) {
            snapshot = await collectionRef.where("slug", "in", slugCandidates).limit(3).get();
            
            if (!snapshot || snapshot.empty) {
                snapshot = await collectionRef.findNearest({
                    vectorField: "embedding",
                    queryVector: queryVector,
                    distanceMeasure: "COSINE",
                    limit: 3,
                }).get();
            }
        } else {
            const searchOptions = {
                vectorField: "embedding",
                queryVector,
                distanceMeasure: "COSINE" as any,
                limit: 3,
            };

            if (slugCandidates.length > 0) {
                snapshot = await collectionRef
                    .where("programSlugs", "array-contains-any", slugCandidates)
                    .findNearest(searchOptions).get();
            }

            if (!snapshot || snapshot.empty) {
                snapshot = await collectionRef.findNearest(searchOptions).get();
            }
        }

        const forumSnapshot = await db.collection("posts")
            .findNearest({
                vectorField: "embedding",
                queryVector: queryVector,
                distanceMeasure: "COSINE",
                limit: 5,
            }).get();

        const threads = forumSnapshot.docs.map(doc => {
            const data = doc.data();
            delete data.embedding;
            return { id: doc.id, ...data };
        });

        const results = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            delete data.embedding;
            return { 
                id: doc.id, 
                intent: intent,
                ...data, 
            };
        });

        return Response.json({ results, intent, threads });
    } catch (error) {
        console.error("Hybrid Search Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}