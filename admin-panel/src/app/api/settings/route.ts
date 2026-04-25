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
        console.log("[SETTINGS_GET] Fetching for schoolId:", schoolId);

        let settings = await SiteSettings.findById(schoolId);

        if (!settings) {
            console.log("[SETTINGS_GET] Document not found for:", schoolId, ". Trying fallback/create.");
            // Try to find global settings as a fallback or create new
            settings = await SiteSettings.findById("global-settings");
            if (!settings) {
                settings = await SiteSettings.create({
                    _id: "global-settings",
                    schoolIds: ["mp-kids-school", "mp-public"],
                    schoolName: "School Website",
                    admissionOpen: true,
                });
                console.log("[SETTINGS_GET] Created default global-settings");
            }
        }

        if (!settings) {
            return NextResponse.json({ message: "Settings could not be initialized" }, { status: 500 });
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        console.error("[SETTINGS_GET] Fatal Error:", error.message);
        return NextResponse.json({ message: error.message || "Internal Error" }, { status: 500 });
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

        const {
            schoolName, contactEmail, contactPhone, address,
            facebookUrl, facebookAccessToken, facebookPageId, facebookEnabled,
            instagramUrl, instagramAccessToken, instagramUserId, instagramEnabled,
            twitterUrl, youtubeUrl, youtubeApiKey, youtubeChannelId, youtubeEnabled,
            admissionOpen, announcement, metaTitle, metaDescription, ogImage, whatsappNumber, mapEmbedUrl,
            affiliationNo,
            trustItem1Text, trustItem1Sub,
            trustItem2Text, trustItem2Sub,
            trustItem3Text, trustItem3Sub,
            trustItem4Text, trustItem4Sub
        } = body;

        const updateData = {
            schoolName,
            contactEmail,
            contactPhone,
            address,
            facebookUrl,
            facebookAccessToken,
            facebookPageId,
            facebookEnabled,
            instagramUrl,
            instagramAccessToken,
            instagramUserId,
            instagramEnabled,
            twitterUrl,
            youtubeUrl,
            youtubeApiKey,
            youtubeChannelId,
            youtubeEnabled,
            admissionOpen,
            announcement,
            metaTitle,
            metaDescription,
            ogImage,
            whatsappNumber,
            mapEmbedUrl,
            affiliationNo,
            trustItem1Text,
            trustItem1Sub,
            trustItem2Text,
            trustItem2Sub,
            trustItem3Text,
            trustItem3Sub,
            trustItem4Text,
            trustItem4Sub,
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
