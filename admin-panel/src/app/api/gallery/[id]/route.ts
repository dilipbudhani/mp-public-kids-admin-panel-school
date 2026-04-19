import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { getSchoolFilter } from "@/lib/schoolFilter";

const galleryUpdateSchema = z.object({
    title: z.string().min(1).optional(),
    imageUrl: z.string().url().optional(),
    publicId: z.string().min(1).optional(),
    type: z.enum(["image", "video"]).optional(),
    thumbnailUrl: z.string().optional(),
    category: z.enum(["Sports", "Events", "Academics", "Campus", "Others"]).optional(),
    date: z.string().optional().transform(v => v ? new Date(v) : undefined),
});

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = galleryUpdateSchema.parse(body);

        const filter = await getSchoolFilter(req, 'schoolIds');
        const galleryItem = await Gallery.findOneAndUpdate(
            { _id: id, ...filter },
            { $set: validatedData },
            { new: true }
        );

        if (!galleryItem) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(galleryItem);
    } catch (error) {
        console.error("[GALLERY_PUT]", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
        }
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
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const galleryItem = await Gallery.findOneAndDelete({ _id: id, ...filter });
        if (!galleryItem) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error("[GALLERY_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
