import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const query = getSchoolFilter(req, 'schoolIds');
        const faculty = await Faculty.find(query).sort({ order: 1 });

        return NextResponse.json(faculty);
    } catch (error) {
        console.error("[FACULTY_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, designation, department, qualification, experience, imageUrl, order } = body;

        if (!name || !designation) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const schoolId = getSchoolId(req);

        const facultyItem = await Faculty.create({
            name,
            designation,
            department: department || "Primary",
            qualification,
            experience,
            imageUrl,
            order: order || 0,
            schoolIds: body.schoolIds || (schoolId ? [schoolId] : [])
        });

        return NextResponse.json(facultyItem);
    } catch (error) {
        console.error("[FACULTY_POST]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
