/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVector } from "../../../actions/getVector";
import { db } from "../../../actions/getAdmin";
import { groq } from "../../../actions/getGroq";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userQuery = searchParams.get("q");

    if (!userQuery) return Response.json({ error: "Missing query" }, { status: 400 });
    
    try {
        const queryVector = await getVector(userQuery);
        const specializedSlugsSnapshot = await db.collection("programs")
            .findNearest({
                vectorField: "embedding",
                queryVector: queryVector,
                distanceMeasure: "COSINE",
                limit: 15,
            }).get();

        const narrowContextSlugs = specializedSlugsSnapshot.docs.map(
            doc => doc.id || doc.data().slug
        ).filter(Boolean);

        const intentResponse = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are an elite academic search router and entity classifier for a Philippine higher education portal.
                    
                    TASK 1: Classify the user query into EXACTLY one of these intents based on what target collection they expect to browse:
                    - 'scholarships': Requests for financial aid, grants, vouchers, or stipends.
                    - 'single_university': Intent target is one specific school by name or acronym (e.g., 'DLSU', 'UP', 'Ateneo').
                    - 'multiple_universities': Explicitly browsing for school choices, institutional options, regional groups, or campus clusters (e.g., 'top schools in manila', 'universities offering accountancy', or any analogous request).
                    - 'programs': The user wants a direct list, summary, or deep-dive of curriculum options, degree courses, majors, or ideal programs for SHS strands (e.g., 'best programs for abm students', 'stem degree options', 'accountancy curriculum details', or any analogous request).

                    TASK 2: Ground colloquial programmatic search queries into valid database slug entries.
                    - Review this tightly filtered list of highly relevant system slugs: ${JSON.stringify(narrowContextSlugs)}
                    - Map the user's intent to the exact matching production slug(s) from this provided array.
                    - If the exact match doesn't exist or is a broad strand request (like ABM or STEM), select up to 3 closest semantic alternative program tracks explicitly from this list (e.g., ABM -> ['bs-in-accountancy', 'bs-in-business-administration']). Do not introduce outside formulations.
                    - If the query does not specify a field of study or degree, return an empty array [].

                    Return ONLY a strict JSON object structure matching this interface without markdown styling:
                    {
                        "intent": "scholarships" | "single_university" | "multiple_universities" | "programs",
                        "slugCandidates": string[],
                        "normalizedQuery": string
                    }`
                },
                { role: "user", content: `Query: "${userQuery}"` }
            ],
            temperature: 0,
            model: "openai/gpt-oss-120b",
            response_format: { type: "json_object" },
        });

        const rawContent = intentResponse.choices[0].message.content || "{}";
        const parsed = JSON.parse(rawContent);
        
        const intent = parsed.intent || "multiple_universities";
        const slugCandidates = (parsed.slugCandidates || []).slice(0, 10);
            
        let results: any[] = [];
        const targetCollection = (intent === "programs") ? "programs" : "universities";
        const collectionRef = db.collection(targetCollection);

        switch (intent) {
            case "scholarships": {
                const scholarshipSnapshot = await db.collection("scholarships")
                    .findNearest({
                        vectorField: "embedding",
                        queryVector: queryVector,
                        distanceMeasure: "COSINE",
                        limit: 10,
                    }).get();

                results = scholarshipSnapshot.docs.map(doc => {
                    const data = doc.data();
                    delete data.embedding;
                    return { id: doc.id, ...data };
                });
                break;
            }

            case "single_university": {
                if (slugCandidates.length > 0) {
                    const slugSnapshot = await collectionRef.where("slug", "in", slugCandidates).limit(1).get();
                    if (!slugSnapshot.empty) {
                        results = slugSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    }
                }
                
                if (results.length === 0) {
                    const vectorSingleSnapshot = await collectionRef.findNearest({
                        vectorField: "embedding",
                        queryVector: queryVector,
                        distanceMeasure: "COSINE",
                        limit: 1,
                    }).get();
                    results = vectorSingleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                }
                break;
            }

            case "programs": {
                if (slugCandidates.length > 0) {
                    const programSnapshot = await collectionRef.where("slug", "in", slugCandidates).limit(5).get();
                    results = programSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                }
                
                if (results.length === 0) {
                    const vectorProgramSnapshot = await collectionRef.findNearest({
                        vectorField: "embedding",
                        queryVector: queryVector,
                        distanceMeasure: "COSINE",
                        limit: 5,
                    }).get();
                    results = vectorProgramSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                }
                break;
            }

            case "multiple_universities":
            default: {
                const searchOptions = {
                    vectorField: "embedding",
                    queryVector,
                    distanceMeasure: "COSINE" as any,
                    limit: 6,
                };

                let multiSnapshot;
                if (slugCandidates.length > 0) {
                    multiSnapshot = await collectionRef
                        .where("programSlugs", "array-contains-any", slugCandidates)
                        .findNearest(searchOptions).get();
                }

                if (!multiSnapshot || multiSnapshot.empty) {
                    multiSnapshot = await collectionRef.findNearest(searchOptions).get();
                }

                results = multiSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                break;
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

        results = results.map(item => {
            delete item.embedding;
            return { ...item, intent };
        });

        return Response.json({ results, intent, threads, slugCandidates });
    } catch (error) {
        console.error("Advanced Hybrid Search Classification Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}