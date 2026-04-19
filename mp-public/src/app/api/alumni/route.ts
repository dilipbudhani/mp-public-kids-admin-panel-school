import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Alumni from "@/models/Alumni";
import { z } from "zod";

const alumniSchema = z.object({
    name: z.string().min(2, "Name is required"),
    batch: z.number(),
    profession: z.string().min(2, "Profession is required"),
    organization: z.string().min(2, "Organization is required").default("Not Specified"),
    city: z.string().min(2, "City is required"),
    quote: z.string().default('Proud to be an alumnus of MP Public School!'),
    initials: z.string(),
    color: z.string().default('#3B82F6'),
    email: z.string().email("Invalid email address"),
    linkedin: z.string().optional(),
});

// POST: Create a new alumni registration (Public)
export async function POST(request: Request) {
    let body: any;
    try {
        body = await request.json();

        // Use profession as organization if not provided separately
        if (!body.organization) {
            body.organization = body.profession || "Not Specified";
        }

        // Ensure batch is a number
        if (typeof body.batch === 'string') {
            body.batch = parseInt(body.batch);
        }

        const validatedData = alumniSchema.parse(body);

        await dbConnect();

        const person = await Alumni.create({
            name: validatedData.name,
            batch: validatedData.batch,
            profession: validatedData.profession,
            organization: validatedData.organization,
            city: validatedData.city,
            quote: validatedData.quote,
            initials: validatedData.initials,
            color: validatedData.color,
            isActive: false, // Must be approved by admin
            displayOrder: 0,
            schoolIds: [process.env.SCHOOL_ID || "mp-public"] // Tagging for this app
        });

        return NextResponse.json(person);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 });
        }
        console.error("[ALUMNI_PUBLIC_POST] error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
