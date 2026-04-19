import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Alumni from "@/models/Alumni";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, batch, profession, organization, city, quote, initials, color, isActive, displayOrder } = body;

        if (!id) {
            return NextResponse.json({ message: "Alumni ID is required" }, { status: 400 });
        }

        const filter = getSchoolFilter(req, 'schoolIds');
        const person = await Alumni.findOneAndUpdate(
            { _id: id, ...filter },
            {
                name,
                batch,
                profession,
                organization,
                city,
                quote,
                initials,
                color,
                isActive,
                displayOrder,
            },
            { new: true }
        );

        if (!person) {
            return NextResponse.json({ message: "Alumni not found" }, { status: 404 });
        }

        return NextResponse.json(person);
    } catch (error) {
        console.error("[ALUMNI_PUT]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ message: "Alumni ID is required" }, { status: 400 });
        }

        const filter = getSchoolFilter(req, 'schoolIds');
        const person = await Alumni.findOneAndDelete({ _id: id, ...filter });

        if (!person) {
            return NextResponse.json({ message: "Alumni not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Alumni deleted" });
    } catch (error) {
        console.error("[ALUMNI_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
