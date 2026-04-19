import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Alumni from "@/models/Alumni";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter, getSchoolId } from "@/lib/schoolFilter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const alumni = await Alumni.find(filter).sort({ displayOrder: 1, batch: -1 });

        return NextResponse.json(alumni);
    } catch (error) {
        console.error("[ALUMNI_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        const body = await req.json();
        const { name, batch, profession, organization, city, quote, initials, color, isActive, displayOrder } = body;

        if (!name || !batch || !profession || !organization || !city || !quote || !initials || !color) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Handle schoolId detection for both admin and public submissions
        const schoolId = getSchoolId(req);

        // Security: If not logged in, force isActive to false and ignore displayOrder
        const finalIsActive = session ? (isActive !== undefined ? isActive : true) : false;
        const finalDisplayOrder = session ? (displayOrder || 0) : 0;

        const person = await Alumni.create({
            name,
            batch,
            profession,
            organization,
            city,
            quote,
            initials,
            color,
            isActive: finalIsActive,
            displayOrder: finalDisplayOrder,
            schoolIds: [schoolId]
        });

        return NextResponse.json(person);
    } catch (error) {
        console.error("[ALUMNI_POST]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
