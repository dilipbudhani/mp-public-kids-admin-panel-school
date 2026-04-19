import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
        const { status, priority, adminNotes, assignedTo, followUpDate } = body;

        await dbConnect();
        const lead = await Lead.findOneAndUpdate(
            { _id: id, schoolIds: 'mp-kids-school' },
            {
                $set: {
                    status,
                    priority,
                    adminNotes,
                    assignedTo,
                    followUpDate: followUpDate ? new Date(followUpDate) : undefined,
                    resolvedAt: status === "converted" || status === "lost" ? new Date() : undefined,
                }
            },
            { new: true }
        );

        if (!lead) {
            return new NextResponse("Lead not found", { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error("[LEAD_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();
        const lead = await Lead.findOneAndDelete({ _id: id, schoolIds: 'mp-kids-school' });

        if (!lead) {
            return new NextResponse("Lead not found", { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[LEAD_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
