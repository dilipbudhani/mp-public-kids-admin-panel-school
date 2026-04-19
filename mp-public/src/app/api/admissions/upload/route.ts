import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const documentType = formData.get("documentType") as string;
        const applicationNo = formData.get("applicationNo") as string;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: "Invalid file type. Only PDF, JPG, and PNG are allowed." },
                { status: 400 }
            );
        }

        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: "File size too large. Maximum limit is 5MB." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const schoolId = process.env.SCHOOL_ID || "mp-public";
        const folder = `${schoolId}/admissions/${applicationNo}`;
        const filename = `${documentType}_${Date.now()}`;

        const result = (await uploadToCloudinary(buffer, filename, folder)) as {
            url: string;
            publicId: string;
        };

        return NextResponse.json({
            success: true,
            url: result.url,
            publicId: result.publicId,
            documentType,
        });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { success: false, error: "Upload failed: " + error.message },
            { status: 500 }
        );
    }
}
