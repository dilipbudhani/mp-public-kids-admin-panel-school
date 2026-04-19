import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const excludeType = url.searchParams.get('excludeType');
        const enquiryType = url.searchParams.get('enquiryType');

        const query: any = getSchoolFilter(req);
        if (excludeType) query.enquiryType = { $ne: excludeType };
        if (enquiryType) query.enquiryType = enquiryType;

        const leads = await Lead.find(query).sort({ createdAt: -1 });
        return NextResponse.json(leads);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching leads" }, { status: 500 });
    }
}
