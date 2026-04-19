import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            highlight,
            description,
            badge,
            imageUrl,
            displayOrder,
            isActive,
            cta1Text,
            cta1Href,
            cta2Text,
            cta2Href,
            statValue,
            statLabel
        } = body;

        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolIds');
        const slide = await HeroSlide.findOneAndUpdate(
            { _id: id, ...filter },
            {
                $set: {
                    title,
                    highlight,
                    description,
                    badge,
                    imageUrl,
                    displayOrder,
                    isActive,
                    cta1Text,
                    cta1Href,
                    cta2Text,
                    cta2Href,
                    statValue,
                    statLabel,
                }
            },
            { new: true }
        );

        if (!slide) {
            return NextResponse.json({ message: "Hero slide not found" }, { status: 404 });
        }

        return NextResponse.json(slide);
    } catch (error) {
        console.error("[HERO_PUT]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolIds');
        const slide = await HeroSlide.findOneAndDelete({ _id: id, ...filter });

        if (!slide) {
            return NextResponse.json({ message: "Hero slide not found" }, { status: 404 });
        }

        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error("[HERO_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
