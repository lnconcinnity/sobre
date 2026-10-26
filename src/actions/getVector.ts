import { InferenceClient  } from "@huggingface/inference";

const client = new InferenceClient (process.env.HUGGINGFACE_TOKEN);

export async function getVector(text: string) {
    try {
        const output = await client.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: text,
        });
        return Array.isArray(output[0]) ? (output[0] as number[]) : (output as number[]);
    } catch (error) {
        console.error("HF Inference Error:", error);
        throw error;
    }
}
