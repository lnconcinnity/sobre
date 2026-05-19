import { db } from "../../../../actions/getAdmin";

function slugToTitleCase(slug: string): string {
    return slug
        .split("_")
        .filter(Boolean)
        .map(word => {
            const lower = word.toLowerCase();
            if (["of", "in", "the", "and"].includes(lower)) return lower;
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

export async function GET() {
    try {
        const trendsRef = db.collection("analytics").doc("search_counts");
        const doc = await trendsRef.get();
        
        if (doc.exists) {
            const data = doc.data() || {};
            const consolidatedData: Record<string, number> = {};

            Object.entries(data).forEach(([queryKey, count]) => {
                const normalizedSlug = queryKey
                    .toLowerCase()
                    .trim()
                    .replace(/[-\s]+/g, "_");

                consolidatedData[normalizedSlug] = (consolidatedData[normalizedSlug] || 0) + (count as number);
            });

            const sorted = Object.entries(consolidatedData)
                .map(([query, count]) => ({ query, count }))
                .filter(item => item.count >= 3) 
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            if (sorted.length > 0) {
                return Response.json(sorted.map(item => {
                    const title = slugToTitleCase(item.query);
                    return {
                        id: item.query,
                        label: title,
                        query: title
                    }
                }));
            }
        }
        
        return Response.json([]);
    } catch (error) {
        console.error("Error fetching trends:", error);
        return Response.json({ error: "Analytics failed" }, { status: 500 });
    }
}