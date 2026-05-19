// app/api/user/remove-attachment/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/src/actions/getCloudinary";

export async function POST(req: Request) {
    const { urls } = await req.json();
    await Promise.all(urls.map(async (url: string) => {
        const publicId = url.split('/').slice(-3).join('/').split('.')[0]; 
        await cloudinary.uploader.destroy(publicId);
    }));
    return NextResponse.json({ success: true });
}