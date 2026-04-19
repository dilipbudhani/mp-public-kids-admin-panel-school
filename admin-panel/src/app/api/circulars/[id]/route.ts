import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Circular from "@/models/Circular";
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
        const filter = getSchoolFilter(req, 'schoolIds');
        const circular = await Circular.findOneAndUpdate({ _id: id, ...filter }, data, { new: true });
        if (!circular) return NextResponse.json({ message: "Download not found" }, { status: 404 });
        return NextResponse.json(circular);
    } catch (error) {
        return NextResponse.json({ message: "Failed to update download" }, { status: 500 });
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
        const filter = getSchoolFilter(req, 'schoolIds');
        const circular = await Circular.findOneAndDelete({ _id: id, ...filter });
        if (!circular) return NextResponse.json({ message: "Download not found" }, { status: 404 });
        return NextResponse.json({ message: "Download deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete download" }, { status: 500 });
    }
}
