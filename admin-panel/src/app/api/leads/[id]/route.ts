import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const filter = await getSchoolFilter(req, 'schoolId');
        const lead = await Lead.findOneAndUpdate({ _id: id, ...filter }, { status: body.status }, { new: true });
        if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
        return NextResponse.json(lead);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Error updating lead" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const filter = await getSchoolFilter(req, 'schoolId');
        const lead = await Lead.findOneAndDelete({ _id: id, ...filter });
        if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
        return NextResponse.json({ message: "Lead deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting lead" }, { status: 500 });
    }
}
