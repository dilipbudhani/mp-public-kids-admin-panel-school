import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import SuccessStory from "@/models/SuccessStory";
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
        const { name, batch, category, headline, summary, story, initials, color, isActive, displayOrder } = body;

        if (!id) {
            return NextResponse.json({ message: "Story ID is required" }, { status: 400 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const successStory = await SuccessStory.findOneAndUpdate(
            { _id: id, ...filter },
            {
                name,
                batch,
                category,
                headline,
                summary,
                story,
                initials,
                color,
                isActive,
                displayOrder,
            },
            { new: true }
        );

        if (!successStory) {
            return NextResponse.json({ message: "Story not found" }, { status: 404 });
        }

        return NextResponse.json(successStory);
    } catch (error) {
        console.error("[SUCCESS_STORIES_PUT]", error);
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
            return NextResponse.json({ message: "Story ID is required" }, { status: 400 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const successStory = await SuccessStory.findOneAndDelete({ _id: id, ...filter });

        if (!successStory) {
            return NextResponse.json({ message: "Story not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Story deleted" });
    } catch (error) {
        console.error("[SUCCESS_STORIES_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
