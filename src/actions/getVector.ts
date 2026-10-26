import { groq } from "./getGroq";

export async function getVector(text: string) {
    try {
        const response = await fetch(`${process.env.UPSTASH_VECTOR_REST_URL}/embeddings`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.UPSTASH_VECTOR_REST_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Upstash Status ${response.status}: ${errText}`);
        }

        const json = await response.json();
        return json.result as number[];
    } catch (error) {
        console.error("Upstash Vector Error:", error);
        return Array(384).fill(0.01) as number[];
    }
}
