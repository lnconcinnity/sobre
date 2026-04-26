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
        return Response.json({ status: "ignored" });
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
                    content: "You are a search sanitizer. Convert queries into 1-3 word trending topics. If the query is absolute nonsense, return the word 'REJECT'. Example: 'i want to be a nurse' -> 'Nursing'. 'asdfgh' -> 'REJECT'." 
                }, { role: "user", content: raw }],
                model: "llama-3.1-8b-instant",
            });

            const aiResult = completion.choices[0].message.content?.trim() || "";
            if (aiResult.includes("REJECT")) return Response.json({ status: "rejected" });
            
            normalized = aiResult.toLowerCase();
            await analyticsRef.doc("search_mappings").set({ [raw]: normalized }, { merge: true });
        }
    }
    await analyticsRef.doc("search_counts").set({
        [normalized]: firestore.FieldValue.increment(1)
    }, { merge: true });
    return Response.json({ success: true });
}