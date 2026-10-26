import { groq } from "./getGroq"

export async function getVector(text: string) {
    try {
        const response = await groq.embeddings.create({
            model: "nomic-embed-text-v1_5",
            input: text,
        });

        const fullEmbedding = response.data[0].embedding;
        return fullEmbedding.slice(0, 384) as number[];
    } catch (error) {
        console.error("Groq Embedding Error:", error);
        throw error;
    }
}
