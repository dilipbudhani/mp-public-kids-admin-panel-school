import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Circular from "@/models/Circular";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const query = getSchoolFilter(req, 'schoolIds');
        const circulars = await Circular.find(query).sort({ date: -1 });
        return NextResponse.json(circulars);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch circulars" }, { status: 500 });
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
        const circular = await Circular.create(data);
        return NextResponse.json(circular, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create circular" }, { status: 500 });
    }
}
