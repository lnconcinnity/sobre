import { db } from "@/src/actions/getAdmin";
import { getVector } from "@/src/actions/getVector";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userQuery = searchParams.get("q");

    if (!userQuery || userQuery.trim().length < 2) {
        return Response.json({ results: [] });
    }

    const cleanQuery = userQuery.trim();
    const lowerQuery = cleanQuery.toLowerCase();

    try {
        const queryVector = await getVector(cleanQuery);
        
        const searchConfig = {
            vectorField: "embedding",
            queryVector: queryVector,
            distanceMeasure: "COSINE" as const,
            limit: 3,
        };

        const [uniSnap, programSnap, postsSnap] = await Promise.all([
            db.collection("universities").findNearest(searchConfig).get(),
            db.collection("programs").findNearest(searchConfig).get(),
            db.collection("posts").findNearest({ ...searchConfig, limit: 5 }).get()
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawResults: any[] = [];

        uniSnap.docs.forEach((doc) => {
            const data = doc.data();
            rawResults.push({
                id: doc.id,
                label: data.name || "Unknown Institution",
                query: data.slug || doc.id,
                category: "University",
                icon: "🏫",
                searchTokens: [data.name, ...(data.aliases || []), data.slug]
            });
        });

        programSnap.docs.forEach((doc) => {
            const data = doc.data();
            rawResults.push({
                id: doc.id,
                label: data.name || "Unknown Program",
                query: data.slug || doc.id,
                category: "Program",
                icon: "🎓",
                searchTokens: [data.name, data.slug]
            });
        });

        postsSnap.docs.forEach((doc) => {
            const data = doc.data();
            rawResults.push({
                id: doc.id,
                label: data.title || "Community Discussion",
                query: data.title || doc.id,
                category: "Discussion",
                icon: "💬",
                searchTokens: [data.title, ...(data.tags || [])]
            });
        });

        const filteredResults = rawResults.filter(item => {
            const haystack = item.searchTokens
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            
            return haystack.includes(lowerQuery);
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const finalResults = filteredResults.map(({ searchTokens, ...cleanItem }) => cleanItem).slice(0, 6);

        return Response.json({ results: finalResults });

    } catch (error) {
        console.error("Instant Preview Vector Query Error:", error);
        return Response.json({ error: "Failed to fetch semantic previews" }, { status: 500 });
    }
}