import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const [
            totalStudents,
            activeStudents,
            classStatsRaw,
            genderStatsRaw,
            recentStudents
        ] = await Promise.all([
            Student.countDocuments({ schoolIds: 'mp-kids-school' }),
            Student.countDocuments({ status: "active", schoolIds: 'mp-kids-school' }),
            Student.aggregate([
                { $match: { status: "active", schoolIds: 'mp-kids-school' } },
                { $group: { _id: "$class", count: { $sum: 1 } } }
            ]),
            Student.aggregate([
                { $match: { status: "active", schoolIds: 'mp-kids-school' } },
                { $group: { _id: "$gender", count: { $sum: 1 } } }
            ]),
            Student.find({ schoolIds: 'mp-kids-school' }).sort({ createdAt: -1 }).limit(5)
        ]);

        const classStats = classStatsRaw.map(s => ({ class: s._id, _count: { _all: s.count } }));
        const genderStats = genderStatsRaw.map(s => ({ gender: s._id, _count: { _all: s.count } }));

        return NextResponse.json({
            totalStudents,
            activeStudents,
            classStats,
            genderStats,
            recentStudents
        });
    } catch (error) {
        console.error("[STUDENT_STATS_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
