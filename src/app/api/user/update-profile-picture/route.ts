/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from "@/src/actions/getCloudinary";
import { NextResponse } from "next/server";
import { db } from "@/src/actions/getAdmin"

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "sobre/uploads", public_id: userId, transformation: [{ width: 200, height: 200, crop: "fill" }] },
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }
        ).end(buffer);
    });

    const secureUrl = (result as any).secure_url;
    await db.collection("users").doc(userId).update({ photoURL: secureUrl });
    return NextResponse.json({ url: secureUrl });
}