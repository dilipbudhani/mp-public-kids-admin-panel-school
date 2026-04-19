import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const filter = await getSchoolFilter(req);
        const slides = await HeroSlide.find(filter).sort({ displayOrder: "asc" });

        return NextResponse.json(slides);
    } catch (error) {
        console.error("[HERO_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
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

        if (!title || !imageUrl) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();
        const schoolId = getSchoolId(req);
        const slide = await HeroSlide.create({
            title,
            highlight: highlight || "",
            description: description || "",
            badge: badge || "",
            imageUrl,
            displayOrder: displayOrder || 0,
            isActive: isActive ?? true,
            cta1Text: cta1Text || "",
            cta1Href: cta1Href || "",
            cta2Text: cta2Text || "",
            cta2Href: cta2Href || "",
            statValue: statValue || "",
            statLabel: statLabel || "",
            schoolIds: [schoolId]
        });

        return NextResponse.json(slide);
    } catch (error) {
        console.error("[HERO_POST]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

