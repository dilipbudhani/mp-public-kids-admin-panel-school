import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import NotificationLog from "@/models/NotificationLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const logs = await NotificationLog.find({ schoolIds: process.env.SCHOOL_ID }).sort({ createdAt: -1 });

        return NextResponse.json(logs);
    } catch (error) {
        console.error("[NOTIFICATION_HISTORY_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
