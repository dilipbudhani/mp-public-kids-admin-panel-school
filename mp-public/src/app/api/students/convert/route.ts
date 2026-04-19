import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";
import Student from "@/models/Student";
import { generateStudentId } from "@/lib/generateStudentId";

export async function POST(req: NextRequest) {
    try {
        const { admissionId } = await req.json();

        if (!admissionId) {
            return NextResponse.json({ error: "Admission ID is required" }, { status: 400 });
        }

        await dbConnect();
        // 1. Fetch the admission record
        const admission = await Admission.findOne({ _id: admissionId, schoolId: process.env.SCHOOL_ID });

        if (!admission) {
            return NextResponse.json({ error: "Admission not found" }, { status: 404 });
        }

        if (admission.status !== "APPROVED") {
            return NextResponse.json({ error: "Admission must be approved before creating a student record" }, { status: 400 });
        }

        // Check if student already exists for this application to prevent duplicates
        const existingStudent = await Student.findOne({
            schoolId: process.env.SCHOOL_ID,
            $or: [
                { email: admission.email },
                { fullName: admission.studentName, fatherName: admission.fatherName }
            ]
        });

        if (existingStudent) {
            return NextResponse.json({ error: "A student record with this name or email already exists" }, { status: 400 });
        }

        // 2. Generate unique student ID
        const studentId = await generateStudentId(admission.academicYear);

        // 3. Create the student record
        const student = await Student.create({
            studentId,
            fullName: admission.studentName,
            dateOfBirth: admission.dateOfBirth,
            gender: admission.gender,
            class: admission.applyingForClass,
            section: "A", // Default
            academicYear: admission.academicYear,
            admissionDate: new Date().toISOString().split('T')[0],
            fatherName: admission.fatherName,
            motherName: admission.motherName,
            primaryContact: admission.primaryContact,
            email: admission.email,
            address: admission.address,
            city: admission.city,
            pincode: admission.pincode,
            schoolId: process.env.SCHOOL_ID || "mp-public",
            status: "active",
        });

        // 4. Update admission record to note student creation
        await Admission.findOneAndUpdate({ _id: admissionId, schoolId: process.env.SCHOOL_ID }, {
            $set: {
                adminNotes: `${admission.adminNotes || ""}\n\n[SYSTEM]: Student record created with ID: ${studentId} on ${new Date().toLocaleDateString()}`
            }
        });

        return NextResponse.json({
            success: true,
            message: "Student record created successfully",
            studentId: student.studentId,
            id: student._id
        });

    } catch (error) {
        console.error("[STUDENT_CONVERT_POST]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
