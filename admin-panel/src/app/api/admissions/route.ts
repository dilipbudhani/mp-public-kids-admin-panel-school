import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Admission from '@/models/Admission';
import { z } from 'zod';
import { getSchoolFilter, getSchoolId } from '@/lib/schoolFilter';

const admissionUpdateSchema = z.object({
    status: z.enum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'WAITLISTED']),
    paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'UNPAID', 'PAID']),
    adminNotes: z.string().optional(),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = getSchoolFilter(req);
        const admissions = await Admission.find(filter).sort({ createdAt: -1 });
        return NextResponse.json(admissions);
    } catch (error) {
        console.error("[ADMISSIONS_GET]", error);
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
        await dbConnect();

        const schoolId = getSchoolId(req);

        const admission = await Admission.create({
            ...body,
            schoolId: body.schoolId || schoolId
        });
        return NextResponse.json(admission);
    } catch (error) {
        console.error("[ADMISSIONS_POST]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
