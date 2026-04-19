import { dbConnect } from "./mongodb";
import Admission from "@/models/Admission";

/**
 * Generates a unique application number for a given academic year.
 * Format: MPKS-[YEAR]-[4-DIGIT-SEQUENCE]
 * Example: MPKS-2026-0001
 */
export async function generateApplicationNo(academicYear: string): Promise<string> {
    await dbConnect();
    const yearPart = academicYear.split("-")[0];

    const lastAdmission = await Admission.findOne({
        applicationNo: {
            $regex: `^MPKS-${yearPart}-`,
        },
    })
        .sort({ applicationNo: -1 })
        .select("applicationNo");

    let nextNumber = 1;
    if (lastAdmission) {
        const lastSeq = lastAdmission.applicationNo.split("-").pop();
        if (lastSeq) {
            const parsedSeq = parseInt(lastSeq, 10);
            if (!isNaN(parsedSeq)) {
                nextNumber = parsedSeq + 1;
            }
        }
    }

    const sequence = nextNumber.toString().padStart(4, "0");
    return `MPKS-${yearPart}-${sequence}`;
}
