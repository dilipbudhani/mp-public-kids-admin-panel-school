import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import News from "@/models/News";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const query = getSchoolFilter(req, 'schoolIds');
        const news = await News.find(query).sort({ date: -1 });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching news" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const schoolId = getSchoolId(req);
        if (schoolId && !body.schoolIds) {
            body.schoolIds = [schoolId];
        }
        const news = await News.create(body);
        return NextResponse.json(news, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Error creating news" }, { status: 500 });
    }
}
