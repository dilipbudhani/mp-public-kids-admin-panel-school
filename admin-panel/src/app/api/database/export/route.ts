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

export async function GET(req: Request) {
    try {
        await dbConnect();

        const url = new URL(req.url);
        const schoolId = url.searchParams.get("schoolId");

        const zip = new AdmZip();
        const models = mongoose.models;

        for (const modelName of Object.keys(models)) {
            const Model = models[modelName];
            const hasSchoolId = !!Model.schema.paths.schoolId;
            const hasSchoolIds = !!Model.schema.paths.schoolIds;

            let filter: any = {};
            if (hasSchoolId && schoolId) filter = { schoolId };
            else if (hasSchoolIds && schoolId) filter = { schoolIds: schoolId };

            const data = await Model.find(filter).lean().exec();

            if (data && data.length > 0) {
                zip.addFile(
                    `${modelName}.json`,
                    Buffer.from(JSON.stringify(data, null, 2), "utf8")
                );
            }
        }

        const zipBuffer = zip.toBuffer();

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        return new NextResponse(zipBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="database_backup_${timestamp}.zip"`,
            },
        });
    } catch (error: any) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
