/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from "../../../actions/getGroq";
import { getUserCity } from "../../../actions/getUserCity";

const enrichResults = (results: any[], intent: string) => {
    return results.map((item, index) => {
        const base = {
            refId: index,
            slug: item.slug,
            name: item.name,
        };

        if (intent === "programs") {
            const schools = item.schools || [];
            return {
                ...base,
                providers: schools.slice(0, 3).map((s: any) => ({
                    uni_name: s.universityName,
                    uni_slug: s.universitySlug,
                    college: s.college_name,
                    majors: s.offered_majors?.join(", ") || "General",
                    tuition: s.tuition_range?.min ?? "Unavailable",
                    tags: s.tags || [] 
                }))
            };
        } else {
            const minTuition = item.colleges?.reduce((min: number, c: any) => {
                const val = c.tuition_range?.min;
                return (val !== undefined && val < min) ? val : min;
            }, 999999);

            return {
                ...base,
                location: item.location ? `${item.location.city}, ${item.location.campus}` : "N/A",
                summary: item.colleges?.map((c: any) => 
                    `${c.name} (${c.acronym}): ${c.programs.join(", ")}`).join(" | "),
                tuition: minTuition === 999999 ? 0 : minTuition,
                tags: item.tags || []
            };
        }
    });
};

export async function POST(req: Request) {
    try {
        const { query, searchResults, intent } = await req.json();
        const userCity = await getUserCity();
        const profile = enrichResults(searchResults, intent);

        const systemPrompt = `
            You are an elite, sharp-witted Philippine College Admissions Consultant. You're the mentor students wish they had—realistic, deeply knowledgeable about Metro Manila/Provincial vibes, and strictly professional.

            STRICT DATA LOCKDOWN:
            1. Every object in the Enriched Data has a "slug". You MUST return the "slug" in your JSON.
            2. Link your analysis ONLY to the data provided for that specific slug.
            3. Use the "summary" (for universities) or "providers" (for programs) as your only source of academic truth.

            USER CONTEXT: 
            - Resident of: ${userCity}
            - Query: "${query}" 
            - Intent: ${intent}

            --- INTENT: UNIVERSITIES (Lifestyle & Logistics) ---
            - **PROJECTED_TF**: Use the tuition value. Format: "₱[min]k-[max]k/sem". If 0, write "FREE (State Uni)".
            - **WHY**: A punchy, 30-word expert take. Use the summary and tags to flex your expertise. End with a period and inspire.
            - **FOOTNOTES**: Be the commute guru (max 15 words). Focus ONLY on the trek from ${userCity}. Mention specific traffic spots (e.g., "The C5 struggle is real") or transit wins (LRT/MRT/Jeep routes).

            --- INTENT: PROGRAMS (Career & Grind) ---
            - **PROJECTED_TF**: Range the "providers" tuition data.
            - **WHY**: This must be a JSON object where each key is the "uni_slug" from the providers list.
            - **WHY CONTENT**: For each university, give a 15-word reason why THEIR version of this program is worth it (e.g., "Top-tier facilities" or "Highest passing rate").
            - **FOOTNOTES**: Some honest talk about the academic grind of this degree in general.

            --- THE COUNSELOR'S COMPLAINT (CONCERNS) ---
            If the request is vague or a "reality check" is needed (e.g., asking for Harvard on a ₱0 budget), generate 1-2 witty "Notes". If the request is smart, return [].

            JSON STRUCTURE:
            {
                "results": [
                    { 
                        "slug": "...", 
                        "projected_tf": "...", 
                        "why": "..." | { [uni_slug]: "..." },
                        "footnotes": "..." 
                    }
                ],
                "concerns": []
            }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { 
                    role: "user", 
                    content: `DATASET TO ANALYZE: ${JSON.stringify(profile)}` 
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.1,
            response_format: { type: "json_object" },
        });

        const narrativeData = JSON.parse(chatCompletion.choices[0].message.content || "{}");
        
        const narrativeMap = (narrativeData.results || []).reduce((acc: any, curr: any) => {
            if (curr.slug) {
                let whyContent = curr.why;
                if (intent === "universities" && typeof whyContent === 'object') {
                    whyContent = Object.values(whyContent).join(" ");
                }
                acc[curr.slug] = {
                    projected_tf: curr.projected_tf,
                    why: whyContent,
                    footnotes: curr.footnotes
                };
            }
            return acc;
        }, {});

        return Response.json({
            results: narrativeMap,
            concerns: narrativeData.concerns || []
        });
    } catch (error: any) {
        console.error("Error in /api/search/reason:", error);
        return Response.json({ error: "Failed" }, { status: 500 });
    }
}