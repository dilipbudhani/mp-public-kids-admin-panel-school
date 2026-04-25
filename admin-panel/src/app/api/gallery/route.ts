import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export const dynamic = "force-dynamic";

const gallerySchema = z.object({
    title: z.string().min(1),
    imageUrl: z.string().url(),
    publicId: z.string().min(1),
    type: z.enum(["image", "video"]),
    thumbnailUrl: z.string().optional(),
    category: z.enum(["Sports", "Events", "Academics", "Campus", "Others"]),
    date: z.string().optional().transform(v => v ? new Date(v) : new Date()),
});

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const filter = getSchoolFilter(req, 'schoolIds');
        console.log("[GALLERY_GET] Fetching with filter:", JSON.stringify(filter));

        const items = await Gallery.find(filter).sort({ date: -1 });
        console.log(`[GALLERY_GET] Found ${items.length} items`);

        return NextResponse.json(items);
    } catch (error) {
        console.error("[GALLERY_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = gallerySchema.parse(body);
        const schoolId = getSchoolId(req);

        const galleryItem = await Gallery.create({
            ...validatedData,
            schoolIds: [schoolId]
        });

        return NextResponse.json(galleryItem);
    } catch (error) {
        console.error("[GALLERY_POST]", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
