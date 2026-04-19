import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const filter = await getSchoolFilter(req);
        const testimonials = await Testimonial.find(filter).sort({ displayOrder: 1 });

        return NextResponse.json(testimonials);
    } catch (error) {
        console.error("[TESTIMONIALS_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, role, content, rating, avatarUrl, isActive, displayOrder } = body;

        if (!name || !role || !content) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const schoolId = getSchoolId(req);
        const testimonial = await Testimonial.create({
            name,
            role,
            content,
            rating: rating || 5,
            avatarUrl,
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
            schoolIds: [schoolId]
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("[TESTIMONIALS_POST]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
