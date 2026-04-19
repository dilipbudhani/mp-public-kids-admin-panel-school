import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Job from "@/models/Job";
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

        const filter = await getSchoolFilter(req);
        const jobs = await Job.find(filter).sort({ displayOrder: 1 });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error("[JOBS_GET]", error);
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
        const { title, department, category, experience, qualification, type, location, vacancies, isActive, displayOrder } = body;

        if (!title || !department || !category || !experience || !qualification || !location) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const schoolId = getSchoolId(req);
        const job = await Job.create({
            title,
            department,
            category,
            experience,
            qualification,
            type: type || 'Full-time',
            location,
            vacancies: vacancies || 1,
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
            schoolIds: [schoolId]
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error("[JOBS_POST]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
