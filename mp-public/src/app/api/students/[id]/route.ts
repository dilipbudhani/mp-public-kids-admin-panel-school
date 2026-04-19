import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const student = await Student.findOne({ _id: id, schoolId: process.env.SCHOOL_ID });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        return NextResponse.json(student);
    } catch (error) {
        console.error("[STUDENT_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const body = await req.json();
        const student = await Student.findOneAndUpdate(
            { _id: id, schoolId: process.env.SCHOOL_ID },
            { $set: body },
            { new: true }
        );

        return NextResponse.json(student);
    } catch (error) {
        console.error("[STUDENT_PATCH]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        // Soft delete by updating status to "left"
        const student = await Student.findOneAndUpdate(
            { _id: id, schoolId: process.env.SCHOOL_ID },
            { $set: { status: "left" } },
            { new: true }
        );

        return NextResponse.json({ message: "Student marked as left", student });
    } catch (error) {
        console.error("[STUDENT_DELETE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
