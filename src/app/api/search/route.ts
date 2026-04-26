/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVector } from "../../actions/getVector";
import { db } from "../../actions/getAdmin";
import { groq } from "../../actions/getGroq";

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

                    INTENT RULES:
                    - isProgram = true: ONLY for queries asking "Suggest me degrees...", "What programs are good for...", "What degrees are okay for...", "What is...", "Define...", "Subjects in...", or "Curriculum for...".
                    - isProgram = false: For "Best schools for...", "Where to study...", "Colleges offering...", even if a specific major is mentioned.
                    - ALWAYS predict the base program slug (e.g., Computer Science) even if a major (e.g., Software Tech) is specified.

                    EXAMPLES:
                    1. "What is BS in Computer Science?" -> { "isProgram": true, "slugCandidates": ["bs-in-computer-science"] }
                    2. "Best schools for computer science specifically major in software technology" -> { "isProgram": false, "slugCandidates": ["bs-in-computer-science"] }
                    
                    SLUG RULES:
                    - Standardize all Bachelor degrees to: "bs-in-[subject]" or "ba-in-[subject]".
                    - Include common variations to ensure array-contains-any hits.
                    - Example: "Accountancy" -> { "isProgram": false, "slugCandidates": ["bs-in-accountancy", "bs-in-accounting"] }

                    Return JSON: { "isProgram": boolean, "slugCandidates": string[] }`
                },
                { role: "user", content: userQuery }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" },
        });

        const parsed = JSON.parse(intentResponse.choices[0].message.content || "{}");
        let isProgram = parsed.isProgram;
        
        const slugCandidates = (parsed.slugCandidates || [])
            .map((s: string) => getSlugFromUserQuery(s))
            .slice(0, 10);
            
        const queryVector = await getVector(userQuery);

        const forceUniversity = /school|university|college|where to|best/i.test(userQuery);
        if (forceUniversity) isProgram = false;
        
        const intent = isProgram ? "programs" : "universities";
        const collectionRef = db.collection(intent);

        let snapshot;
        
        if (isProgram && slugCandidates.length > 0) {
            snapshot = await collectionRef.where("slug", "in", slugCandidates).limit(3).get();
            
            if (snapshot.empty) {
                snapshot = await collectionRef.findNearest({
                    vectorField: "embedding",
                    queryVector: queryVector,
                    distanceMeasure: "COSINE",
                    limit: 3,
                }).get();
            }
        } else {
            let queryChain: any = collectionRef;
            
            if (slugCandidates.length > 0) {
                queryChain = queryChain.where("programSlugs", "array-contains-any", slugCandidates);
            }

            snapshot = await queryChain.findNearest({
                vectorField: "embedding",
                queryVector: queryVector,
                distanceMeasure: "COSINE",
                limit: 3, 
            }).get();

            if (snapshot.empty) {
                snapshot = await collectionRef.findNearest({
                    vectorField: "embedding",
                    queryVector: queryVector,
                    distanceMeasure: "COSINE",
                    limit: 3,
                }).get();
            }
        }

        const results = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            delete data.embedding;
            return { 
                id: doc.id, 
                intent: intent,
                ...data, 
            };
        });

        return Response.json({ results, intent });

    } catch (error) {
        console.error("Hybrid Search Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}