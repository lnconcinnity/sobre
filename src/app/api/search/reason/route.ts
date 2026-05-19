/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from "../../../../actions/getGroq";
import { getUserCity } from "../../../../actions/getUserCity";
import { db } from "../../../../actions/getAdmin";

export async function POST(req: Request) {
    try {
        const { query, leanResults, intent, slugCandidates = [] } = await req.json();
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
                        providers: schools.slice(0, 3).map((s: any) => ({
                            uni_name: s.universityName,
                            uni_slug: s.universitySlug,
                            college: s.college_name,
                            majors: s.offered_majors?.join(", ") || "General",
                            tuition: s.tuition_range?.min ?? "Unavailable",
                            heroImage: s.heroImage || null,
                        }))
                    });
                } else {
                    validSlugsList.add(base.ownerKey);

                    const minTuition = dbData.colleges?.reduce((min: number, c: any) => {
                        const val = c.tuition_range?.min || c.tuition;
                        return (val !== undefined && val < min) ? val : min;
                    }, 999999);

                    profile.push({
                        ...base,
                        location: dbData.location ? (typeof dbData.location === 'object' ? `${dbData.location.city}, ${dbData.location.campus}` : dbData.location) : "N/A",
                        summary: dbData.colleges?.map((c: any) => `${c.name}: ${c.programs?.join(", ")}`).join(" | "),
                        tuition: minTuition === 999999 ? 0 : minTuition,
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

            --- USER CONTEXT ---
            - Resident of: ${userCity}
            - Query: "${query}" 
            - Intent: ${intent}
            - Targeted Curriculums: ${JSON.stringify(slugCandidates)}

            --- OUTPUT RULES ---
            1. MINIMUM LENGTH: Every "WHY" must be at least 40 words. If it's too short, you aren't doing your job.
            2. VISUAL STRUCTURE: Use \\n line breaks to separate the "hook," the "meat," and the "verdict" inside your text values.
            3. TEXT FORMATTING: Write like a human consultant. Never echo raw slug strings, kebab-case tokens, or lowercase technical handles (e.g., do NOT write "bachelors-in-laws", "bs-computer-science", or "juris-doctor"). Transform them into elegant, title-cased editorial titles (e.g., "Bachelor of Laws", "Legal Management", or "Juris Doctor").
            4. NO BLEED: 
               - If intent = UNIVERSITIES: FOOTNOTES = Commute/Logistics from ${userCity}.
               - If intent = PROGRAMS: FOOTNOTES = The Academic Grind/Difficulty of that specific degree.

            --- INTENT: UNIVERSITIES (Lifestyle & Logistics) ---
            - **PROJECTED_TF**: Use the tuition value. Format: "₱[min]k-[max]k/sem". If 0, write "FREE (State Uni)". If none, write "UNAVAILABLE".
            - **WHY**: A high-conviction, 40-50 word expert take on how this university contextualizes the targeted curriculums. Focus on the "Social Capital" of the school. How does this name look on a resume in BGC or Makati? 
            - **FOOTNOTES**: "The Commute Truth." 25 words specifically about the trek from ${userCity}. Use landmark-based pain points (e.g., "The Cubao interchange hell," "Crossing the Pasig River rush").

            --- INTENT: PROGRAMS (Career & Grind) ---
            - **PROJECTED_TF**: Use the tuition value. Format: "₱[min]k-[max]k/sem". If 0, write "FREE (State Uni)". If none, write "UNAVAILABLE".
            - **WHY**: A JSON object { "uni_slug": "Analysis" } or a string text block matching the parent program document context depending on schema.
                - CONTENT: 40-50 words per school item. Contrast them fiercely. Give a brutally realistic verdict.
            - **FOOTNOTES**: 35-45 words on the academic rigor of ${query}. Is it a 'no-sleep' Architecture plate-fest? A math-heavy Engineering torture? Or a high-stakes Nursing clinical grind? Tell the truth.
            
            JSON STRUCTURE:
            {
                "results": [
                    { 
                        "ownerKey": "...", 
                        "projected_tf": "...", 
                        "why": "..." | { [uni_slug]: "..." },
                        "footnotes": "..." 
                    }
                ],
            }
        `;
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `DATASET TO ANALYZE: ${JSON.stringify(profile)}` }
            ],
            model: "llama-3.3-70b-versatile",
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