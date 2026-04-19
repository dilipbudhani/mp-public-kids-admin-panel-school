import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Disclosure from '@/models/Disclosure';

export async function GET() {
    try {
        await dbConnect();
        const disclosures = await Disclosure.find({ schoolIds: 'mp-kids-school' }).sort({ section: 1, order: 1 });
        return NextResponse.json(disclosures);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch disclosures' }, { status: 500 });
    }
}
