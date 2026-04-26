import { NextResponse } from "next/server";
import { pushUniversities } from "../../../scripts/seed";

export async function GET() {
    try {
        await pushUniversities();
        return NextResponse.json({ message: "Database seeded successfully!" });
    } catch (error) {
        console.error("Seeding failed:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}