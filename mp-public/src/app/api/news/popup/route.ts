import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import News from "@/models/News";

export async function GET() {
    try {
        await dbConnect();
        // Find the latest published notice that should be shown in a popup
        const latestPopupNotice = await News.findOne({
            isPublished: true,
            showPopup: true,
            schoolIds: process.env.SCHOOL_ID
        }).sort({ date: -1 });

        return NextResponse.json(latestPopupNotice || null);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching popup notice" }, { status: 500 });
    }
}
