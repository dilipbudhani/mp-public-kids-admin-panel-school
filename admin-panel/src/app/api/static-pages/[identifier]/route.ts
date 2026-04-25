import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ identifier: string }> }
) {
    const { identifier } = await params;
    try {
        await dbConnect();

        const query: any = mongoose.Types.ObjectId.isValid(identifier)
            ? { _id: identifier }
            : { slug: identifier };

        // Apply school filter if fetching by slug
        if (!mongoose.Types.ObjectId.isValid(identifier)) {
            const filter = getSchoolFilter(req, 'schoolIds');
            Object.assign(query, filter);
        }

        const page = await StaticPage.findOne(query);

        if (!page) {
            return NextResponse.json({ message: "Page not found" }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error("[STATIC_PAGE_GET]", error);
        return NextResponse.json({ message: "Error fetching page" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ identifier: string }> }
) {
    const { identifier } = await params;
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const query: any = mongoose.Types.ObjectId.isValid(identifier)
            ? { _id: identifier }
            : { slug: identifier };

        // Apply school filter if fetching by slug
        if (!mongoose.Types.ObjectId.isValid(identifier)) {
            const filter = getSchoolFilter(req, 'schoolIds');
            Object.assign(query, filter);
        }

        const page = await StaticPage.findOneAndUpdate(
            query,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!page) {
            return NextResponse.json({ message: "Page not found" }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error: any) {
        console.error("[STATIC_PAGE_PUT]", error);
        return NextResponse.json({ message: error.message || "Error updating page" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ identifier: string }> }
) {
    const { identifier } = await params;
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const query: any = mongoose.Types.ObjectId.isValid(identifier)
            ? { _id: identifier }
            : { slug: identifier };

        // Apply school filter if deleting by slug
        if (!mongoose.Types.ObjectId.isValid(identifier)) {
            const filter = getSchoolFilter(req, 'schoolIds');
            Object.assign(query, filter);
        }

        const page = await StaticPage.findOneAndDelete(query);

        if (!page) {
            return NextResponse.json({ message: "Page not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Page deleted successfully" });
    } catch (error: any) {
        console.error("[STATIC_PAGE_DELETE]", error);
        return NextResponse.json({ message: error.message || "Error deleting page" }, { status: 500 });
    }
}
