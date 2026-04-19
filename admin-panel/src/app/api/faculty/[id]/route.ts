import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, designation, department, qualification, experience, imageUrl, order } = body;

        const filter = getSchoolFilter(req, 'schoolIds');
        const facultyItem = await Faculty.findOneAndUpdate(
            { _id: id, ...filter },
            {
                name,
                designation,
                department,
                qualification,
                experience,
                imageUrl,
                order,
            },
            { new: true }
        );

        if (!facultyItem) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(facultyItem);
    } catch (error) {
        console.error("[FACULTY_PUT]", error);
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
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const filter = getSchoolFilter(req, 'schoolIds');
        const facultyItem = await Faculty.findOneAndDelete({ _id: id, ...filter });
        if (!facultyItem) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error("[FACULTY_DELETE]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
