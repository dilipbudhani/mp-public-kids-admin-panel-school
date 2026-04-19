import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { z } from "zod";
import { sendWhatsApp, templates } from "@/lib/whatsapp";

const leadSchema = z.object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().regex(/^[0-9]{10}$/).optional().or(z.literal("")),
    enquiryType: z.string(),
    message: z.string().min(10), // Reduced min length for testimonials
    source: z.string().default("contact_form"),
    relation: z.string().optional(),
    classBatch: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
});

// GET: List leads (Admin only)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const priority = searchParams.get("priority");

        const where = {
            ...(status && status !== "all" ? { status } : {}),
            ...(priority && priority !== "all" ? { priority } : {}),
        };

        await dbConnect();
        const leads = await Lead.find({ ...where, schoolIds: 'mp-kids-school' }).sort({ createdAt: -1 });

        return NextResponse.json(leads);
    } catch (error) {
        console.error("[LEADS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST: Create a new lead (Public)
export async function POST(request: Request) {
    let body: any;
    try {
        body = await request.json();
        const validatedData = leadSchema.parse(body);

        await dbConnect();
        const lead = await Lead.create({
            ...validatedData,
            schoolIds: 'mp-kids-school',
            status: "New",
            priority: "Medium",
        });

        // Trigger WhatsApp Notification (Async/Non-blocking)
        if (lead.phone) {
            sendWhatsApp(
                lead.phone,
                templates.newLeadAck(lead.name, lead.enquiryType)
            ).catch(err => console.error("WhatsApp notification failed:", err));
        }

        return NextResponse.json(lead);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 });
        }
        console.error("[LEADS_POST] error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
