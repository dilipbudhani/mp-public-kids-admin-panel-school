import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Achievement from "@/models/Achievement";

export async function GET() {
    try {
        await dbConnect();
        const achievements = await Achievement.find({ schoolIds: 'mp-kids-school', isActive: true }).sort({ createdAt: -1 });
        return NextResponse.json(achievements);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
