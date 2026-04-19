import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import NotificationLog from "@/models/NotificationLog";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = getSchoolFilter(req);

        // Fetch logs tied to this school
        const logs = await NotificationLog.find(filter)
            .sort({ sentAt: -1 })
            .limit(100)
            .lean();

        // Map model data to frontend expectation
        // Frontend expects: id, createdAt, message, target, sent, failed, total
        const formattedLogs = logs.map((log: any) => ({
            id: log._id.toString(),
            createdAt: log.sentAt,
            message: `${log.template}: ${log.type}`,
            target: log.recipient,
            sent: log.status === 'sent' ? 1 : 0,
            failed: log.status === 'failed' ? 1 : 0,
            total: 1
        }));

        return NextResponse.json(formattedLogs);
    } catch (error: any) {
        console.error("DEBUG: Notifications API Error:", error);
        return NextResponse.json(
            { message: error.message || "Failed to fetch notification history" },
            { status: 500 }
        );
    }
}
