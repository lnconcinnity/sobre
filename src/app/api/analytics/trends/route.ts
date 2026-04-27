import { db } from "../../../../actions/getAdmin";

export async function GET() {
    try {
        const trendsRef = db.collection("analytics").doc("search_counts");
        const doc = await trendsRef.get();
        if (doc.exists) {
            const data = doc.data() || {};
            const sorted = Object.entries(data)
                .map(([query, count]) => ({ query, count: count as number }))
                .filter(item => item.count >= 3) 
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            if (sorted.length > 0) {
                return Response.json(sorted.map(item => ({
                    id: item.query,
                    label: item.query.charAt(0).toUpperCase() + item.query.slice(1),
                    query: item.query
                })));
            }
        }
        return Response.json([
            { id: "seed1", label: "UPCAT Prep 2026", query: "upcat" },
            { id: "seed2", label: "Best Engineering Schools", query: "engineering" },
            { id: "seed3", label: "Scholarships for South Luzon", query: "scholarships" },
        ]);
    } catch (error) {
        console.error("Error fetching trends:", error);
        return Response.json({ error: "Analytics failed" }, { status: 500 });
    }
}