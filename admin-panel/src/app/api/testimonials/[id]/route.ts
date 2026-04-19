import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
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
        const { name, role, content, rating, avatarUrl, isActive, displayOrder } = body;

        if (!id) {
            return NextResponse.json({ message: "Testimonial ID is required" }, { status: 400 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const testimonial = await Testimonial.findOneAndUpdate(
            { _id: id, ...filter },
            {
                name,
                role,
                content,
                rating,
                avatarUrl,
                isActive,
                displayOrder,
            },
            { new: true }
        );

        if (!testimonial) {
            return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("[TESTIMONIALS_PUT]", error);
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
            return NextResponse.json({ message: "Testimonial ID is required" }, { status: 400 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const testimonial = await Testimonial.findOneAndDelete({ _id: id, ...filter });

        if (!testimonial) {
            return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Testimonial deleted" });
    } catch (error) {
        console.error("[TESTIMONIALS_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
