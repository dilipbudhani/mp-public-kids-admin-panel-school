import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
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
        const achievement = await Achievement.findOneAndUpdate({ _id: id, ...filter }, data, { new: true });
        if (!achievement) return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
        return NextResponse.json(achievement);
    } catch (error) {
        return NextResponse.json({ message: "Failed to update achievement" }, { status: 500 });
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
        const achievement = await Achievement.findOneAndDelete({ _id: id, ...filter });
        if (!achievement) return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
        return NextResponse.json({ message: "Achievement deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete achievement" }, { status: 500 });
    }
}
