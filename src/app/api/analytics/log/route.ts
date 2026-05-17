/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, firestore } from "../../../../actions/getAdmin";
import { groq } from "../../../../actions/getGroq";

function isGibberish(text: string): boolean {
    const t = text.toLowerCase().trim();
    if (!t || t.length < 3 || !/[a-z]/i.test(t)) return true;
    if (/(.)\1{3,}/.test(t)) return true;
    if (t.length >= 8 && t.substring(0, t.length / 2) === t.substring(t.length / 2)) return true;

    const physicalSmashes = ["asdfghjkl", "qwertyuiop", "zxcvbnm", "asdfasdf", "qwerqwer"];
    if (physicalSmashes.some(smash => t.includes(smash))) return true;

    const vowels = (t.match(/[aeiouy]/g) || []).length;
    if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(t)) return true;
    if (vowels === 0 && t.length > 4) return true;

    return false;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const query = body?.query;

        if (!query || isGibberish(query)) {
            return Response.json({ status: "rejected", isBinaryRejected: true });
        }

        const raw = query.toLowerCase().trim();
        const analyticsRef = db.collection("analytics");
        
        const mappingDoc = await analyticsRef.doc("search_mappings").get();
        const mappings = mappingDoc.data() || {};

        if (mappings[raw]) {
            const cachedValue = mappings[raw];
            if (cachedValue === "__rejected__") {
                return Response.json({ status: "rejected", isBinaryRejected: true });
            }
            await incrementSearchAnalytics(analyticsRef, cachedValue);
            return Response.json({ success: true, status: "accepted", normalized: cachedValue });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are an elite search query sanitizer for an educational platform in the Philippines.
                    
                    RULES:
                    1. Set "isRejected" to true if input is random characters, keyboard smash, or toxic nonsense.
                    2. Expand ALL acronyms to their full formal name (e.g., "DLSU" -> "De La Salle University", "UP" -> "University of the Philippines", "UST" -> "University of Santo Tomas").
                    3. Standardize plural terms to singular format (e.g., "Scholarships" -> "Scholarship", "Universities" -> "University").
                    4. Keep core fields consistent (e.g., "Law School" -> "Law").
                    5. Provide a 1-4 word clean structural title case string in "normalized" (e.g., "Computer Science", "Mapua University").

                    OUTPUT FORMAT: Return JSON only. No markdown.
                    { "normalized": string, "isRejected": boolean }`
                }, 
                { role: "user", content: raw }
            ],
            model: "openai/gpt-oss-safeguard-20b",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");
        if (aiResponse.isRejected || !aiResponse.normalized) {
            await analyticsRef.doc("search_mappings").set({ [raw]: "__rejected__" }, { merge: true });
            return Response.json({ status: "rejected", isBinaryRejected: true });
        }

        const targetSlug = aiResponse.normalized
            .toLowerCase()
            .trim()
            .replace(/['"]+/g, '')
            .replace(/[\s]+/g, '_'); 

        await analyticsRef.doc("search_mappings").set({ [raw]: targetSlug }, { merge: true });
        await incrementSearchAnalytics(analyticsRef, targetSlug);

        return Response.json({ success: true, status: "accepted", normalized: targetSlug });

    } catch (error) {
        console.error("Search failure:", error);
        return Response.json({ success: false, error: "Internal processing failure" }, { status: 500 });
    }
}

async function incrementSearchAnalytics(analyticsRef: any, targetSlug: string) {
    await analyticsRef.doc("search_counts").set({
        [targetSlug]: firestore.FieldValue.increment(1)
    }, { merge: true });
}