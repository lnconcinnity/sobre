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
                    content: `Analyze the query for university search.

                    IDENTIFICATION LOGIC:
                    - isProgram = true: The user is seeking INFORMATION ABOUT A FIELD OF STUDY.
                    Keywords: "majors", "degrees", "programs", "curriculum", "what is", "subjects", "pre-med", "pre-law".
                    Phrase Logic: "Best majors for [Career]" or "Degrees for [Career]" implies a program search.
                    
                    - isProgram = false: The user is seeking a PLACE TO ENROLL.
                    Keywords: "schools", "colleges", "universities", "institutions", "where to study", "campuses", "institutions".
                    Phrase Logic: "Best schools for [Major]" implies a university search.
                    
                    SLUG RULES:
                    - Standardize all Bachelor degrees to: "bs-in-[subject]" or "ba-in-[subject]".
                    - Include common variations to ensure array-contains-any hits.
                    - Example: "Accountancy" -> { "isProgram": false, "slugCandidates": ["bs-in-accountancy", "bs-in-accounting"] }

                    EXAMPLES:
                    1. "Best majors for law school" -> { "isProgram": true, "slugCandidates": ["ba-in-political-science", "ba-in-philosophy", "ba-in-legal-management"] }
                    2. "What are the subjects in BSCS?" -> { "isProgram": true, "slugCandidates": ["bs-in-computer-science"] }
                    3. "Top universities for nursing" -> { "isProgram": false, "slugCandidates": ["bs-in-nursing"] }
                    4. "Where can I study accountancy?" -> { "isProgram": false, "slugCandidates": ["bs-in-accountancy", "bs-in-accounting"] }
                    
                    Return JSON: { "isProgram": boolean, "slugCandidates": string[] }`
                },
                { role: "user", content: userQuery }
            ],
            temperature: 0,
            model: "qwen/qwen3-32b",
            response_format: { type: "json_object" },
        });

        const parsed = JSON.parse(intentResponse.choices[0].message.content || "{}");
        const isProgram = parsed.isProgram;
        const slugCandidates = (parsed.slugCandidates || [])
            .map((s: string) => getSlugFromUserQuery(s))
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
            const queryChain = collectionRef;
            const searchOptions = {
                vectorField: "embedding",
                queryVector,
                distanceMeasure: "COSINE" as any,
                limit: 3,
            };

            if (slugCandidates.length > 0) {
                snapshot = await queryChain
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