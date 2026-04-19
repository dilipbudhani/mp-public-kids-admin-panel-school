import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import SchoolEvent from "@/models/SchoolEvent";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const filter = await getSchoolFilter(req);
        const events = await SchoolEvent.find(filter).sort({ date: 1 });
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching events" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const schoolId = getSchoolId(req);
        const event = await SchoolEvent.create({
            ...body,
            schoolIds: [schoolId]
        });
        return NextResponse.json(event, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Error creating event" }, { status: 500 });
    }
}
