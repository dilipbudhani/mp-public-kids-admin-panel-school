import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Stat from "@/models/Stat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const data = await req.json();
        const filter = await getSchoolFilter(req, 'schoolIds');
        const stat = await Stat.findOneAndUpdate({ _id: id, ...filter }, data, { new: true });
        if (!stat) return NextResponse.json({ message: "Stat not found" }, { status: 404 });
        return NextResponse.json(stat);
    } catch (error) {
        return NextResponse.json({ message: "Failed to update stat" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolIds');
        const stat = await Stat.findOneAndDelete({ _id: id, ...filter });
        if (!stat) return NextResponse.json({ message: "Stat not found" }, { status: 404 });
        return NextResponse.json({ message: "Stat deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete stat" }, { status: 500 });
    }
}
