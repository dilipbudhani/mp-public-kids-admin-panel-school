import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendWhatsApp, templates } from "@/lib/whatsapp";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { status, adminNotes } = body;

        // Validate status if provided
        if (status && !["PENDING", "REVIEWING", "APPROVED", "REJECTED", "WAITLISTED"].includes(status)) {
            return new NextResponse("Invalid status", { status: 400 });
        }

        await dbConnect();
        const admission = await Admission.findOneAndUpdate(
            { _id: id, schoolId: process.env.SCHOOL_ID },
            {
                $set: {
                    status,
                    adminNotes,
                    reviewedAt: status !== "PENDING" ? new Date() : undefined,
                }
            },
            { new: true }
        );

        if (!admission) {
            return new NextResponse("Admission not found", { status: 404 });
        }

        // Trigger WhatsApp Notification based on status (Async/Non-blocking)
        const triggerNotification = () => {
            if (!admission.primaryContact) return;

            let message = "";
            if (status === "APPROVED") {
                message = templates.admissionApproved(admission.studentName, admission.applicationNo);
            } else if (status === "REJECTED") {
                message = templates.admissionRejected(admission.studentName);
            } else {
                message = templates.admissionStatusUpdate(admission.studentName, admission.applicationNo, status);
            }

            sendWhatsApp(admission.primaryContact, message)
                .catch(err => console.error("WhatsApp notification failed:", err));
        };

        triggerNotification();

        return NextResponse.json(admission);
    } catch (error) {
        console.error("[ADMISSION_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
