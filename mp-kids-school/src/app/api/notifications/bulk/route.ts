import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Student from "@/models/Student";
import NotificationLog from "@/models/NotificationLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { target, classFilter, studentId, message } = body;

        let students = [];

        if (target === 'all') {
            students = await Student.find({ status: 'active', schoolIds: 'mp-kids-school' })
                .select('fullName primaryContact');
        } else if (target === 'class') {
            students = await Student.find({ status: 'active', class: classFilter, schoolIds: 'mp-kids-school' })
                .select('fullName primaryContact');
        } else if (target === 'individual') {
            students = await Student.find({ _id: studentId, schoolIds: 'mp-kids-school' })
                .select('fullName primaryContact');
        } else if (target === 'selected' && Array.isArray(studentId)) {
            students = await Student.find({ _id: { $in: studentId }, schoolIds: 'mp-kids-school' })
                .select('fullName primaryContact');
        }

        const total = students.length;
        let sent = 0;
        let failed = 0;

        // Send messages in parallel but with Settled to catch errors
        const results = await Promise.allSettled(
            students.map((student: any) =>
                sendWhatsApp(
                    student.primaryContact,
                    `Notice for ${student.fullName}: ${message} - Regards, MP Kids School`
                )
            )
        );

        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value.success) {
                sent++;
            } else {
                failed++;
            }
        });

        // Log the notification
        await NotificationLog.create({
            schoolIds: 'mp-kids-school',
            message,
            target: target === 'class' ? `Class: ${classFilter}` : target,
            sent,
            failed,
            total
        });

        return NextResponse.json({ sent, failed, total });
    } catch (error) {
        console.error("[BULK_NOTIFICATIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
