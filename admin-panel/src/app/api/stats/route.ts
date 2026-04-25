import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Stat from "@/models/Stat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const filter = getSchoolFilter(req, 'schoolIds');
        const stats = await Stat.find(filter).sort({ displayOrder: 1 });
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const data = await req.json();
        const schoolId = getSchoolId(req);
        const stat = await Stat.create({
            ...data,
            schoolIds: [schoolId]
        });
        return NextResponse.json(stat, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create stat" }, { status: 500 });
    }
}
