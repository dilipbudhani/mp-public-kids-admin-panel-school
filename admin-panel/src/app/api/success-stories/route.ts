import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import SuccessStory from "@/models/SuccessStory";
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

        const filter = await getSchoolFilter(req, 'schoolIds');
        const stories = await SuccessStory.find(filter).sort({ displayOrder: 1 });

        return NextResponse.json(stories);
    } catch (error) {
        console.error("[SUCCESS_STORIES_GET]", error);
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
        const { name, batch, category, headline, summary, story, initials, color, isActive, displayOrder } = body;

        if (!name || !batch || !category || !headline || !summary || !story || !initials || !color) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const schoolId = getSchoolId(req);
        const successStory = await SuccessStory.create({
            name,
            batch,
            category,
            headline,
            summary,
            story,
            initials,
            color,
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
            schoolIds: [schoolId]
        });

        return NextResponse.json(successStory);
    } catch (error) {
        console.error("[SUCCESS_STORIES_POST]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
