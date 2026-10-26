import { groq } from "./getGroq";

export async function getVector(text: string) {
    try {
        const response = await fetch(
            "https://huggingface.co",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputs: text }),
            }
        );
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HF Status ${response.status}: ${errText}`);
        }
        const output = await response.json();
        return Array.isArray(output) ? (output as number[]) : (output as number[]);
    } catch (error) {
        console.error("HF Anonymous Inference Error:", error);
        throw error;
    }
}
