import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Admission from '@/models/Admission';
import { z } from 'zod';
import { getSchoolFilter } from '@/lib/schoolFilter';

const admissionUpdateSchema = z.object({
    status: z.enum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'WAITLISTED']).optional(),
    paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'UNPAID', 'PAID']).optional(),
    adminNotes: z.string().optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolId');
        const admission = await Admission.findOne({ _id: id, ...filter });

        if (!admission) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(admission);
    } catch (error) {
        console.error("[ADMISSION_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = admissionUpdateSchema.parse(body);

        await dbConnect();

        const updateData: any = { ...validatedData };
        if (validatedData.status) {
            updateData.reviewedAt = new Date();
        }

        const filter = await getSchoolFilter(req, 'schoolId');
        const admission = await Admission.findOneAndUpdate(
            { _id: id, ...filter },
            updateData,
            { new: true }
        );

        if (!admission) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(admission);
    } catch (error) {
        console.error("[ADMISSION_PATCH]", error);
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
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolId');
        const admission = await Admission.findOneAndDelete({ _id: id, ...filter });

        if (!admission) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error("[ADMISSION_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
