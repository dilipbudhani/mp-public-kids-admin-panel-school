import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Stat from "@/models/Stat";

export async function GET() {
    try {
        await dbConnect();
        const stats = await Stat.find({ isActive: true, schoolIds: 'mp-kids-school' }).sort({ createdAt: -1 });
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
