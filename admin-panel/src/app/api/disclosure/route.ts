import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Disclosure from '@/models/Disclosure';
import { getSchoolFilter, getSchoolId } from '@/lib/schoolFilter';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const filter = await getSchoolFilter(req);
        const disclosures = await Disclosure.find(filter).sort({ section: 1, order: 1 });
        return NextResponse.json(disclosures);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch disclosures' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const schoolId = getSchoolId(req);
        await dbConnect();

        const disclosure = await Disclosure.create({
            ...body,
            schoolIds: [schoolId]
        });
        return NextResponse.json(disclosure, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create disclosure' }, { status: 500 });
    }
}
