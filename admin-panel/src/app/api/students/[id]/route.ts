import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Student from '@/models/Student';
import { z } from 'zod';
import { getSchoolFilter } from "@/lib/schoolFilter";

const studentUpdateSchema = z.object({
    fullName: z.string().optional(),
    class: z.string().optional(),
    section: z.string().optional(),
    rollNo: z.string().optional(),
    academicYear: z.string().optional(),
    status: z.string().optional(),
    primaryContact: z.string().optional(),
    email: z.string().email().optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolId');
        const student = await Student.findOne({ _id: id, ...filter });

        if (!student) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(student);
    } catch (error) {
        console.error("[STUDENT_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = studentUpdateSchema.parse(body);

        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolId');
        const student = await Student.findOneAndUpdate(
            { _id: id, ...filter },
            validatedData,
            { new: true }
        );

        if (!student) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(student);
    } catch (error) {
        console.error("[STUDENT_PATCH]", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolId');
        const student = await Student.findOneAndDelete({ _id: id, ...filter });

        if (!student) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error("[STUDENT_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
