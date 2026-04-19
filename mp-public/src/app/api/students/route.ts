import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Student from "@/models/Student";
import { generateStudentId } from "@/lib/generateStudentId";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const className = searchParams.get("class") || "";
        const status = searchParams.get("status") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { studentId: { $regex: search, $options: "i" } },
                { primaryContact: { $regex: search, $options: "i" } },
            ];
        }
        if (className) where.class = className;
        if (status) where.status = status;
        where.schoolId = process.env.SCHOOL_ID;

        await dbConnect();

        const [students, total] = await Promise.all([
            Student.find(where)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Student.countDocuments(where),
        ]);

        return NextResponse.json({
            students,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("[STUDENTS_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            fullName,
            dateOfBirth,
            gender,
            bloodGroup,
            aadhaarNo,
            class: className,
            section,
            rollNo,
            academicYear,
            admissionDate,
            fatherName,
            motherName,
            primaryContact,
            email,
            address,
            city,
            pincode,
        } = body;

        // Generate unique student ID
        const studentId = await generateStudentId(academicYear);

        await dbConnect();
        const student = await Student.create({
            studentId,
            fullName,
            dateOfBirth,
            gender,
            bloodGroup,
            aadhaarNo,
            class: className,
            section: section || "A",
            rollNo,
            academicYear,
            admissionDate,
            fatherName,
            motherName,
            primaryContact,
            email,
            address,
            city,
            pincode,
            schoolId: process.env.SCHOOL_ID || "mp-public",
            status: "active",
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error("[STUDENTS_POST]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
