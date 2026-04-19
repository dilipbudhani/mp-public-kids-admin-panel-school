import { dbConnect } from "./mongodb";
import Student from "@/models/Student";

/**
 * Generates a unique student ID for a given academic year.
 * Format: MPKS-STU-YYYY-XXXXX
 * Example: MPKS-STU-2025-00001
 */
export async function generateStudentId(academicYear: string): Promise<string> {
    const yearPart = academicYear.split("-")[0];

    await dbConnect();
    const lastStudent = await Student.findOne({
        studentId: { $regex: `^MPKS-STU-${yearPart}-` }
    }).sort({ studentId: -1 });

    let nextNumber = 1;
    if (lastStudent) {
        const parts = lastStudent.studentId.split("-");
        const lastSeq = parts[parts.length - 1];
        if (lastSeq) {
            const parsedSeq = parseInt(lastSeq, 10);
            if (!isNaN(parsedSeq)) {
                nextNumber = parsedSeq + 1;
            }
        }
    }

    const sequence = nextNumber.toString().padStart(5, "0");
    return `MPKS-STU-${yearPart}-${sequence}`;
}
