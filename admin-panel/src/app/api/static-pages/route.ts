import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const filter = await getSchoolFilter(req);
        const pages = await StaticPage.find(filter).sort({ title: 1 });
        return NextResponse.json(pages);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching pages" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const schoolId = getSchoolId(req);

        // Ensure slug is unique for this school
        const existing = await StaticPage.findOne({
            slug: body.slug,
            schoolIds: { $in: [schoolId] }
        });
        if (existing) {
            return NextResponse.json({ message: "Slug already exists for this school" }, { status: 400 });
        }

        const page = await StaticPage.create({
            ...body,
            schoolIds: [schoolId]
        });
        return NextResponse.json(page, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Error creating page" }, { status: 500 });
    }
}
