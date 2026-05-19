import cloudinary from "./getCloudinary";
import fetch from "node-fetch";

export const cacheImage = async (url: string, folder: string, publicId: string): Promise<string> => {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        if (!response.ok) throw new Error(`Fetch failed with status ${response.status} for ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    folder, 
                    public_id: publicId,
                    overwrite: true,
                    transformation: [{ width: 1200, height: 800, crop: "fill" }, { quality: "auto" }]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (result as any).secure_url;
    } catch (error) {
        console.error("Local fetch/upload failed:", error);
        return url;
    }
};