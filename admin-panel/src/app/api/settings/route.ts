import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolId } from "@/lib/schoolFilter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const schoolId = getSchoolId(req) || "global-settings";
        let settings = await SiteSettings.findById(schoolId);

        if (!settings && schoolId !== "global-settings") {
            // Try to find global settings as a fallback or create new
            settings = await SiteSettings.findById("global-settings");
            if (!settings) {
                settings = await SiteSettings.create({
                    _id: "global-settings",
                    schoolIds: ["mp-kids-school", "mp-public"],
                    schoolName: "School Website",
                    admissionOpen: true,
                });
            }
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const schoolId = getSchoolId(req) || body.id || "global-settings";

        const { schoolName, contactEmail, contactPhone, address, facebookUrl, instagramUrl, twitterUrl, youtubeUrl, admissionOpen, announcement, metaTitle, metaDescription, ogImage, whatsappNumber, mapEmbedUrl } = body;

        const updateData = {
            schoolName,
            contactEmail,
            contactPhone,
            address,
            facebookUrl,
            instagramUrl,
            twitterUrl,
            youtubeUrl,
            admissionOpen,
            announcement,
            metaTitle,
            metaDescription,
            ogImage,
            whatsappNumber,
            mapEmbedUrl,
            schoolIds: schoolId === "global-settings" ? ["mp-kids-school", "mp-public"] : [schoolId]
        };

        const settings = await SiteSettings.findByIdAndUpdate(
            schoolId,
            { $set: updateData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_PUT]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
