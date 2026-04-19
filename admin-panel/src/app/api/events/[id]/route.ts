import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import SchoolEvent from "@/models/SchoolEvent";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const filter = getSchoolFilter(req, 'schoolIds');
        const event = await SchoolEvent.findOne({ _id: id, ...filter });
        if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching event" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const body = await req.json();
        const filter = getSchoolFilter(req, 'schoolIds');
        const event = await SchoolEvent.findOneAndUpdate({ _id: id, ...filter }, body, { new: true });
        if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });
        return NextResponse.json(event);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Error updating event" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const filter = getSchoolFilter(req, 'schoolIds');
        const event = await SchoolEvent.findOneAndDelete({ _id: id, ...filter });
        if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });
        return NextResponse.json({ message: "Event deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting event" }, { status: 500 });
    }
}
