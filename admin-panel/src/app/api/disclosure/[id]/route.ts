import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Disclosure from '@/models/Disclosure';
import { getSchoolFilter } from '@/lib/schoolFilter';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        const filter = getSchoolFilter(req, 'schoolIds');
        const disclosure = await Disclosure.findOneAndUpdate({ _id: id, ...filter }, body, { new: true });
        if (!disclosure) {
            return NextResponse.json({ error: 'Disclosure not found' }, { status: 404 });
        }

        return NextResponse.json(disclosure);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update disclosure' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const filter = getSchoolFilter(req, 'schoolIds');
        const disclosure = await Disclosure.findOneAndDelete({ _id: id, ...filter });
        if (!disclosure) {
            return NextResponse.json({ error: 'Disclosure not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Disclosure deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete disclosure' }, { status: 500 });
    }
}
