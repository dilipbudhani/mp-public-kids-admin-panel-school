import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import AlumniTestimonial from "@/models/AlumniTestimonial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { id } = await params;
        const data = await req.json();
        const item = await AlumniTestimonial.findByIdAndUpdate(id, data, { new: true });
        if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ message: "Failed to update testimonial" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { id } = await params;
        await AlumniTestimonial.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete testimonial" }, { status: 500 });
    }
}
