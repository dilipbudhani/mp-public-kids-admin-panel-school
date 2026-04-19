import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import News from "@/models/News";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchoolFilter } from "@/lib/schoolFilter";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const filter = await getSchoolFilter(req, 'schoolIds');
        const news = await News.findOne({ _id: id, ...filter });
        if (!news) return NextResponse.json({ message: "News not found" }, { status: 404 });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching news" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const filter = await getSchoolFilter(req, 'schoolIds');
        const news = await News.findOneAndUpdate({ _id: id, ...filter }, body, { new: true });
        if (!news) return NextResponse.json({ message: "News not found" }, { status: 404 });
        return NextResponse.json(news);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Error updating news" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const filter = await getSchoolFilter(req, 'schoolIds');
        const news = await News.findOneAndDelete({ _id: id, ...filter });
        if (!news) return NextResponse.json({ message: "News not found" }, { status: 404 });
        return NextResponse.json({ message: "News deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting news" }, { status: 500 });
    }
}
