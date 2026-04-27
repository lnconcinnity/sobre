/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from "../../../../actions/getGroq";
import { getUserCity } from "../../../../actions/getUserCity";

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

            --- DATA INTEGRITY ---
            1. Every object in the Enriched Data has a "slug". You MUST return the "slug" in your JSON.
            2. Link your analysis ONLY to the data provided for that specific slug.
            3. Use the "summary" (for universities) or "providers" (for programs) as your only source of academic truth.

            --- USER CONTEXT ---
            - Resident of: ${userCity}
            - Query: "${query}" 
            - Intent: ${intent}

            --- OUTPUT RULES ---
            1. MINIMUM LENGTH: Every "WHY" must be at least 40 words. If it's too short, you aren't doing your job.
            2. VISUAL STRUCTURE: Use \n line breaks to separate the "hook," the "meat," and the "verdict."
            3. NO BLEED: 
            - If intent = UNIVERSITIES: FOOTNOTES = Commute/Logistics from ${userCity}.
            - If intent = PROGRAMS: FOOTNOTES = The Academic Grind/Difficulty of that specific degree.

            --- INTENT: UNIVERSITIES (Lifestyle & Logistics) ---
            - **PROJECTED_TF**: Use the tuition value. Format: "₱[min]k-[max]k/sem". If 0, write "FREE (State Uni)". If none, write "UNAVAILABLE".
            - **WHY**: A high-conviction, 40-50 word expert take. Focus on the "Social Capital" of the school. How does this name look on a resume in BGC or Makati? 
            - **FOOTNOTES**: "The Commute Truth." 25 words specifically about the trek from ${userCity}. Use landmark-based pain points (e.g., "The Cubao interchange hell," "Crossing the Pasig River rush").

            --- INTENT: PROGRAMS (Career & Grind) ---
            - **PROJECTED_TF**: Use the tuition value. Format: "₱[min]k-[max]k/sem". If 0, write "FREE (State Uni)". If none, write "UNAVAILABLE".
            - **WHY**: A JSON object { "uni_slug": "Analysis" }. 
                - CONTENT: 40-50 words per school. Contrast them fiercely. Does one school have better labs? Does the other have the "old boys network" for this industry? 
            - **FOOTNOTES**: 35-45 words on the academic rigor of ${query}. Is it a 'no-sleep' Architecture plate-fest? A math-heavy Engineering torture? Or a high-stakes Nursing clinical grind? Tell the truth.
            
            --- CONCERNS ---
            If the request is vague or a "reality check" is needed (e.g., asking for Harvard on a ₱0 budget or a broad program like "engineering"), generate 1-2 witty "notes" with flair on the array "concerns." If the request is smart, return [].

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
            model: "llama-3.3-70b-versatile",
            temperature: 0.4,
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