import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongodb";
import AdmZip from "adm-zip";

// Models import
import "@/models/Achievement";
import "@/models/NotificationLog";
import "@/models/SuccessStory";
import "@/models/User";
import "@/models/Student";
import "@/models/Testimonial";
import "@/models/StaticPage";
import "@/models/SiteSettings";
import "@/models/Stat";
import "@/models/School";
import "@/models/Admission";
import "@/models/Program";
import "@/models/Lead";
import "@/models/SchoolEvent";
import "@/models/News";
import "@/models/Job";
import "@/models/HeroSlide";
import "@/models/Gallery";
import "@/models/Faculty";
import "@/models/Facility";
import "@/models/Disclosure";
import "@/models/Alumni";
import "@/models/Circular";
import "@/models/FeeStructure";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow 60s for Vercel execution

export async function POST(req: Request) {
    try {
        await dbConnect();

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();

        const models = mongoose.models;
        const targetSchoolId = req.headers.get("x-school-id");
        const importMode = req.headers.get("x-import-mode") || "restore";

        for (const zipEntry of zipEntries) {
            if (!zipEntry.isDirectory && zipEntry.entryName.endsWith(".json")) {
                const modelName = zipEntry.entryName.replace(".json", "");
                if (models[modelName]) {
                    const Model = models[modelName];
                    const content = zipEntry.getData().toString("utf8");
                    const data = JSON.parse(content);

                    if (Array.isArray(data) && data.length > 0) {
                        try {
                            const hasSchoolId = !!Model.schema.paths.schoolId;
                            const hasSchoolIds = !!Model.schema.paths.schoolIds;

                            if (importMode === "merge") {
                                // Clone data without erasing anything
                                if (!hasSchoolId && !hasSchoolIds) {
                                    // Skip global models during merge to prevent duplicating global data like users unnecessarily
                                    continue;
                                }

                                const safeData = data.map((item: any) => {
                                    delete item._id;
                                    delete item.createdAt;
                                    delete item.updatedAt;
                                    if (hasSchoolId && targetSchoolId) {
                                        item.schoolId = targetSchoolId;
                                    }
                                    if (hasSchoolIds && targetSchoolId) {
                                        item.schoolIds = [targetSchoolId];
                                    }
                                    return item;
                                });
                                await Model.insertMany(safeData, { lean: true });
                            } else {
                                // Restore Mode
                                if ((hasSchoolId || hasSchoolIds) && targetSchoolId) {
                                    if (hasSchoolId) {
                                        await Model.deleteMany({ schoolId: targetSchoolId });
                                    } else {
                                        await Model.deleteMany({ schoolIds: targetSchoolId });
                                    }
                                    const safeData = data.map((item: any) => {
                                        if (hasSchoolId) {
                                            item.schoolId = targetSchoolId;
                                        }
                                        if (hasSchoolIds) {
                                            item.schoolIds = [targetSchoolId];
                                        }
                                        return item;
                                    });
                                    await Model.insertMany(safeData, { lean: true });
                                } else {
                                    // Global collection restore (upsert to avoid wiping items not in backup)
                                    for (const item of data) {
                                        if (item._id) {
                                            await Model.findByIdAndUpdate(item._id, item, { upsert: true });
                                        }
                                    }
                                }
                            }
                        } catch (err: any) {
                            console.error(`Error importing ${modelName}:`, err.message);
                        }
                    }
                }
            }
        }

        return NextResponse.json({ message: "Import successful" }, { status: 200 });
    } catch (error: any) {
        console.error("Import Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
