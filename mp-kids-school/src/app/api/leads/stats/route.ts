import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();
        const [total, newLeads, contacted, converted] = await Promise.all([
            Lead.countDocuments({ schoolIds: 'mp-kids-school' }),
            Lead.countDocuments({ status: "New", schoolIds: 'mp-kids-school' }),
            Lead.countDocuments({ status: "Contacted", schoolIds: 'mp-kids-school' }),
            Lead.countDocuments({ status: "Converted", schoolIds: 'mp-kids-school' }),
        ]);

        return NextResponse.json({
            total,
            new: newLeads,
            contacted,
            qualified: 0, // Placeholder if needed, but not in model
            converted,
        });
    } catch (error) {
        console.error("[LEADS_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
