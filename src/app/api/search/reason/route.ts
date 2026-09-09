/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from "../../../../actions/getGroq";
import { getUserCity } from "../../../../actions/getUserCity";
import { db } from "../../../../actions/getAdmin";

export async function POST(req: Request) {
    try {
        const { query, leanResults, intent, slugCandidates = [], blob = null } = await req.json();
        const userCity = await getUserCity();

        const targetCollection = intent === "programs" ? "programs" : "universities";
        const collectionRef = db.collection(targetCollection);

        const profile: any[] = [];
        const validSlugsList = new Set<string>();

        for (const item of leanResults) {
            const itemId = item.id || item.slug;
            const base = { slug: itemId, ownerKey: itemId, name: item.name };

            try {
                const docSnap = await collectionRef.doc(itemId).get();
                if (!docSnap.exists) continue;
                
                const dbData = docSnap.data() || {};

                if (intent === "programs") {
                    const schools = dbData.schools || [];
                    validSlugsList.add(itemId);
                    profile.push({
                        ...base,
                        providers: schools.map((s: any) => ({
                            uni_name: s.universityName,
                            uni_slug: s.universitySlug,
                            college: s.college_name,
                            majors: s.offered_majors?.join(", ") || "General",
                            tuitionRange: { min: s.tuition_range?.min ?? "Unavailable", max: s.tuition_range?.max ?? "Unavailable" },
                            heroImage: s.heroImage || null,
                        }))
                    });
                } else {
                    validSlugsList.add(base.ownerKey);

                    const tuitionVal = dbData.colleges?.map((c: any) => c.tuition_range?.min ?? c.tuition ?? 0);
                    const minTuition = Math.min(...tuitionVal.filter((n: number) => n > 0));
                    const maxTuition = Math.max(...tuitionVal);

                    profile.push({
                        ...base,
                        location: dbData.location ? (typeof dbData.location === 'object' ? `${dbData.location.city}, ${dbData.location.campus}` : dbData.location) : "N/A",
                        summary: dbData.colleges?.map((c: any) => `${c.name}: ${c.programs?.join(", ")}`).join(" | "),
                        tuitionRange: { min: minTuition, max: maxTuition },
                    });
                }
            } catch (err) {
                console.error(`Failed layer hydration for doc target ${itemId}:`, err);
            }
        }

        if (profile.length === 0) {
            return Response.json({ 
                results: {}, 
                concerns: ["No institutional choices match your selected curriculum target parameters."], 
                strictlyValidSlugs: [] 
            });
        }

        const systemPrompt = `
            You are an elite, sharp-witted Philippine College Admissions Consultant. You're the mentor students wish they had—realistic, deeply knowledgeable about Metro Manila/Provincial vibes, and strictly professional.
            --- DATA INTEGRITY ---
            1. Every object in the Enriched Data has an "ownerKey" and a "slug". You MUST return the "ownerKey" as the main identifier key in your JSON records.
            2. Link your analysis ONLY to the data provided for that specific element entry.
            3. Use the "summary" (for universities) or "providers" (for programs) as your only source of academic truth.
            4. DUPLICATE PROJECTIONS: If a university has multiple colleges with the same price, or a program has redundant tuition data, MERGE THEM. Do not list duplicates.
            5. PRICE FORMATTING:
                - You will receive a 'tuitionRange' object {min, max}.
                - If min === max, format as: "₱[min]k/sem".
                - If min < max, format as: "₱[min]k - [max]k/sem".
                - If 0, write "FREE (State Uni)".
                - NEVER repeat the same number (e.g., do NOT write "40k-40k").
            - CRITICAL: You are provided with a complete list of institutional providers. You MUST provide an analysis for EVERY single provider in the array. Do not prioritize or prune based on perceived relevance.
            --- USER CONTEXT ---
            - Resident of: ${blob?.location || "Manila (Assumed)"}
            - Query: "${query}"
            - Intent: ${intent}
            - Targeted Curriculums: ${JSON.stringify(slugCandidates)}
            ${blob && blob.biography ? `User Biography: ${blob.biography}` : ""}
            --- VOICE & TONE ENFORCEMENT ---
            1. ABSOLUTE NO-FLUFF RULE: Never use generic phrases like "this tier-one provider," "this institution," or "this specialized school."
            2. SUBJECT ANCHORING: You MUST start every analysis sentence by explicitly naming the university (e.g., "Mapúa University excels because...", "Pamantasan ng Lungsod ng Maynila offers...").
            3. CONTEXTUAL DATA: If the provided data mentions specific industry affiliations, board exam track records, or campus culture, incorporate those specific facts rather than vague "tier-one" claims.
            --- OUTPUT RULES ---
            1. MINIMUM LENGTH: Every "WHY" must be at least 40 words. If it's too short, you aren't doing your job.
            2. VISUAL STRUCTURE: Use \\n line breaks to separate the "hook," the "meat," and the "verdict" inside your text values.
            3. TEXT FORMATTING: Write like a human consultant. Never echo raw slug strings, kebab-case tokens, or lowercase technical handles (e.g., do NOT write "bachelors-in-laws", "bs-computer-science", or "juris-doctor"). Transform them into elegant, title-cased editorial titles (e.g., "Bachelor of Laws", "Legal Management", or "Juris Doctor").
            4. NO BLEED:
               - If intent = UNIVERSITIES: FOOTNOTES = Commute/Logistics from ${blob?.location || "Manila (Assumed)"}.
               - If intent = PROGRAMS: FOOTNOTES = The Academic Grind/Difficulty of that specific degree.
            --- INTENT: UNIVERSITIES (Lifestyle & Logistics) ---
            - **PROJECTED_TF**: Use the tuition value. Format: "₱[min]k-[max]k/sem". If 0, write "FREE (State Uni)". If none, write "UNAVAILABLE".
            - **WHY**: A high-conviction, 40-50 word expert take on how this university contextualizes the targeted curriculums. Focus on the "Social Capital" of the school. How does this name look on a resume in BGC or Makati?
            - **FOOTNOTES**: "The Commute Truth." 25 words specifically about the trek from ${blob?.location || "Manila (Assumed)"}. Use landmark-based pain points (e.g., "The Cubao interchange hell," "Crossing the Pasig River rush").
            --- INTENT: PROGRAMS (Career & Grind) ---
            - **PROJECTED_TF**: Use the tuition value. Format: "₱[min]k-[max]k/sem". If 0, write "FREE (State Uni)". If none, write "UNAVAILABLE".
            - **WHY**: An array of objects. Format: [ { "uni_slug": "slug-name", "analysis": "40-50 words. Start the analysis with the full name of the university. Describe specific academic, cultural, or industry reputation traits found in the dataset. Never use the word 'provider' or 'institution'." }, ... ]. YOU MUST INCLUDE EVERY PROVIDER FOUND IN THE DATASET.
            - **FOOTNOTES**: 35-45 words on the academic rigor of ${query}. Is it a 'no-sleep' Architecture plate-fest? A math-heavy Engineering torture? Or a high-stakes Nursing clinical grind? Tell the truth.
            --- INTENT-BASED SCHEMA ENFORCEMENT ---
            YOU MUST FOLLOW ONE OF THESE TWO JSON STRUCTURES EXACTLY:
            IF INTENT == "universities":
            {
                "results": [
                    {
                        "ownerKey": "string",
                        "projected_tf": "string",
                        "why": "string (40-50 words analysis)",
                        "footnotes": "string (25 words commute info)"
                    }
                ]
            }
            IF INTENT == "programs":
            {
                "results": [
                    {
                        "ownerKey": "string",
                        "projected_tf": "string",
                        "why": [
                            { "uni_slug": "string", "analysis": "string" }
                        ],
                        "footnotes": "string"
                    }
                ]
            }
        `;
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Analyze this dataset: " + JSON.stringify(profile) },
            ],
            model: "gpt-oss-120b",
            temperature: 0.4,
            response_format: { type: "json_object" },
        });

        const narrativeData = JSON.parse(chatCompletion.choices[0].message.content || "{}");
        const narrativeMap = (narrativeData.results || []).reduce((acc: any, curr: any) => {
            const fallbackKey = curr.ownerKey || curr.slug;
            if (fallbackKey) {
                acc[fallbackKey] = {
                    projected_tf: curr.projected_tf,
                    why: curr.why,
                    footnotes: curr.footnotes
                };
            }
            return acc;
        }, {});

        return Response.json({
            results: narrativeMap,
            strictlyValidSlugs: Array.from(validSlugsList)
        });
    } catch (error: any) {
        console.error("Error in /api/search/reason:", error);
        return Response.json({ error: "Failed" }, { status: 500 });
    }
}
