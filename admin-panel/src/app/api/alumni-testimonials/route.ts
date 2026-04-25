import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import AlumniTestimonial from "@/models/AlumniTestimonial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const filter = await getSchoolFilter(req, "schoolIds");
        const items = await AlumniTestimonial.find(filter).sort({ displayOrder: 1, createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch testimonials" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const data = await req.json();
        const schoolId = getSchoolId(req);
        const item = await AlumniTestimonial.create({ ...data, schoolIds: [schoolId] });
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create testimonial" }, { status: 500 });
    }
}
