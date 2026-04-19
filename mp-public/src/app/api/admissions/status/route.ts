import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const applicationNo = searchParams.get("applicationNo");

        if (!applicationNo) {
            return NextResponse.json(
                { error: "Application number is required" },
                { status: 400 }
            );
        }

        const admission = await Admission.findOne({ applicationNo, schoolId: process.env.SCHOOL_ID })
            .select('applicationNo studentName applyingForClass academicYear status createdAt reviewedAt adminNotes')
            .lean();

        if (!admission) {
            return NextResponse.json({ found: false });
        }

        // Only return adminNotes if status is not PENDING
        const responseData = {
            found: true,
            ...admission,
            adminNotes: admission.status !== "PENDING" ? admission.adminNotes : null,
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Status check error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
