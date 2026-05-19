import { NextResponse } from "next/server";
import cloudinary from "@/src/actions/getCloudinary";

export async function POST(req: Request) {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    
    const uploads = await Promise.all(files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: "sobre/uploads" }, 
                (err, res) => err ? reject(err) : resolve(res?.secure_url)
            ).end(Buffer.from(arrayBuffer));
        });
    }));

    return NextResponse.json({ urls: uploads });
}