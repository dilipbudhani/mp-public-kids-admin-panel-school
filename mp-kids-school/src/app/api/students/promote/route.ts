import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Student from "@/models/Student";
import { getNextClass, getNextAcademicYear } from "@/lib/promotionUtils";

export async function POST(req: NextRequest) {
    try {
        const { studentIds, targetAcademicYear } = await req.json();

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return NextResponse.json({ error: "No student IDs provided" }, { status: 400 });
        }

        const results = {
            success: 0,
            failed: 0,
            graduated: 0,
            errors: [] as string[]
        };

        await dbConnect();
        for (const id of studentIds) {
            try {
                const student = await Student.findOne({ _id: id, schoolIds: 'mp-kids-school' });

                if (!student) {
                    results.failed++;
                    results.errors.push(`Student not found: ${id}`);
                    continue;
                }

                const nextClass = getNextClass(student.class);
                const nextYear = targetAcademicYear || getNextAcademicYear(student.academicYear);

                if (nextClass === null) {
                    // Graduated
                    await Student.findOneAndUpdate({ _id: id, schoolIds: 'mp-kids-school' }, {
                        $set: {
                            status: "graduated",
                            academicYear: nextYear
                        }
                    });
                    results.graduated++;
                } else {
                    await Student.findOneAndUpdate({ _id: id, schoolIds: 'mp-kids-school' }, {
                        $set: {
                            class: nextClass,
                            academicYear: nextYear
                        }
                    });
                    results.success++;
                }
            } catch (err: any) {
                results.failed++;
                results.errors.push(`Error promoting ${id}: ${err.message}`);
            }
        }

        return NextResponse.json({
            message: "Promotion process completed",
            results
        });

    } catch (error) {
        console.error("[STUDENT_PROMOTE_POST]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
