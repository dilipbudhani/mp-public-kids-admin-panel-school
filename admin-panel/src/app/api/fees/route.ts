import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import FeeStructure from "@/models/FeeStructure";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const filter = await getSchoolFilter(req);
        const data = await FeeStructure.findOne(filter).sort({ createdAt: -1 });
        return NextResponse.json(data || {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch fee structure" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const schoolId = getSchoolId(req);

        // Use findOneAndUpdate with upsert to keep only one active fee structure or update existing for this school
        const data = await FeeStructure.findOneAndUpdate(
            { schoolIds: { $in: [schoolId] } },
            {
                ...body,
                schoolIds: [schoolId]
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error("FEE_POST_ERROR", error);
        return NextResponse.json({ error: "Failed to save fee structure" }, { status: 500 });
    }
}
