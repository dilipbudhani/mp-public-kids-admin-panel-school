import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Student from '@/models/Student';
import { z } from 'zod';
import { getSchoolFilter, getSchoolId } from '@/lib/schoolFilter';

const studentSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    class: z.string().min(1, "Class is required"),
    section: z.string().default("A"),
    rollNo: z.string().optional(),
    academicYear: z.string().min(1, "Academic year is required"),
    admissionDate: z.string().min(1, "Admission date is required"),
    fatherName: z.string().min(1, "Father's name is required"),
    motherName: z.string().min(1, "Mother's name is required"),
    primaryContact: z.string().min(1, "Contact is required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    pincode: z.string().min(1, "Pincode is required"),
    status: z.string().default("active"),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = getSchoolFilter(req);
        const students = await Student.find(filter).sort({ fullName: 1 });
        return NextResponse.json(students);
    } catch (error) {
        console.error("[STUDENTS_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = studentSchema.parse(body);

        await dbConnect();

        const schoolId = getSchoolId(req);
        // Generate a student ID if not provided (mock logic for now)
        const studentId = `STU${Date.now()}`;

        const student = await Student.create({
            ...validatedData,
            studentId,
            schoolId: body.schoolId || schoolId
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error("[STUDENTS_POST]", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
