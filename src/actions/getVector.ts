export async function getVector(text: string) {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/embeddings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: text,
                model: "nomic-embed-text-v1_5"
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Groq Status ${response.status}: ${errText}`);
        }

        const json = await response.json();
        return json.data[0].embedding as number[];
    } catch (error) {
        console.error("Groq Embedding Error:", error);
        throw error;
    }
}
