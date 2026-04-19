import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, department, category, experience, qualification, type, location, vacancies, isActive, displayOrder } = body;

        if (!id) {
            return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const job = await Job.findOneAndUpdate(
            { _id: id, ...filter },
            {
                title,
                department,
                category,
                experience,
                qualification,
                type,
                location,
                vacancies,
                isActive,
                displayOrder,
            },
            { new: true }
        );

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error("[JOBS_PUT]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const job = await Job.findOneAndDelete({ _id: id, ...filter });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Job deleted" });
    } catch (error) {
        console.error("[JOBS_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
