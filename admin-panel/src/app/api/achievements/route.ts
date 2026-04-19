import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const query = getSchoolFilter(req, 'schoolIds');
        const achievements = await Achievement.find(query).sort({ displayOrder: 1, createdAt: -1 });
        return NextResponse.json(achievements);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch achievements" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const data = await req.json();
        const schoolId = getSchoolId(req);
        if (schoolId && !data.schoolIds) {
            data.schoolIds = [schoolId];
        }
        const achievement = await Achievement.create(data);
        return NextResponse.json(achievement, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create achievement" }, { status: 500 });
    }
}
