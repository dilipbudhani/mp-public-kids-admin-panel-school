import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Circular from "@/models/Circular";

export async function GET() {
    try {
        await dbConnect();
        const circulars = await Circular.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ date: -1 });
        return NextResponse.json(circulars);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
