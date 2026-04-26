import { groq } from "../../../actions/getGroq";
import { firestore, db } from "../../../actions/getAdmin";

function isGibberish(text: string): boolean {
    const t = text.toLowerCase().trim();
    if (t.length < 3 || !/[a-z]/.test(t)) return true;
    if (!/[aeiouy]/.test(t) && t.length > 4) return true;
    const hasRepetition = /(.)\1{3,}/.test(t);
    if (hasRepetition) return true;
    if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(t)) return true;
    return false;
}

export async function POST(req: Request) {
    const { query } = await req.json();
    
    if (!query || isGibberish(query)) {
        return Response.json({ status: "rejected", isBinaryRejected: true });
    }

    const raw = query.toLowerCase().trim();
    const analyticsRef = db.collection("analytics");
    const mappingDoc = await analyticsRef.doc("search_mappings").get();
    const mappings = mappingDoc.data() || {};

    let normalized: string;

    if (mappings[raw]) {
        normalized = mappings[raw];
    } else {
        if (raw.split(" ").length <= 2) {
            normalized = raw;
        } else {
            const completion = await groq.chat.completions.create({
                messages: [{ 
                    role: "system", 
                    content: `You are a search sanitizer. Analyze the query and return a JSON object.
                    
                    RULES:
                    - "normalized": Convert query into a 1-3 word trending topic (e.g., "Nursing", "Computer Science").
                    - "isRejected": Set to true IF the query is absolute nonsense, keyboard smashing, or entirely unrelated to education/career. Otherwise, false.
                    
                    FORMAT: { "normalized": string, "isRejected": boolean }`
                }, { role: "user", content: raw }],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });

            const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");
            
            if (aiResponse.isRejected) {
                return Response.json({ status: "rejected", isBinaryRejected: true });
            }
            
            normalized = aiResponse.normalized.toLowerCase();
            await analyticsRef.doc("search_mappings").set({ [raw]: normalized }, { merge: true });
        }
    }

    await analyticsRef.doc("search_counts").set({
        [normalized]: firestore.FieldValue.increment(1)
    }, { merge: true });

    return Response.json({ success: true, status: "accepted" });
}