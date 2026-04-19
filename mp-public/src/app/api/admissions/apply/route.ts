import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";
import { admissionSchema } from "@/lib/validations/admission";
import { generateApplicationNo } from "@/lib/generateApplicationNo";
import { sendWhatsApp, templates } from "@/lib/whatsapp";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Handle Quick Form submissions (from academic pages)
        const isQuickForm = body.isQuickForm === true;

        let validatedData;
        if (isQuickForm) {
            // Pick only what we have in the quick form
            validatedData = admissionSchema.pick({
                studentName: true,
                gender: true,
                applyingForClass: true,
                phone: true,
                email: true
            }).parse(body);

            // Add defaults for fields required by the model
            (validatedData as any).dateOfBirth = body.dateOfBirth || "2000-01-01";
            (validatedData as any).parentName = body.parentName || "Quick Inquiry";
            (validatedData as any).address = body.address || "Quick application from academic page";
            (validatedData as any).city = body.city || "Not Specified";
        } else {
            // Standard full application
            validatedData = admissionSchema.parse(body);
        }

        // Generate unique application number for the current academic year
        const academicYear = "2026-27";
        const applicationNo = await generateApplicationNo(academicYear);

        // Create admission record in database
        const admission = await Admission.create({
            schoolId: process.env.SCHOOL_ID || "mp-public",
            applicationNo,
            studentName: validatedData.studentName,
            dateOfBirth: (validatedData as any).dateOfBirth,
            gender: validatedData.gender,
            applyingForClass: validatedData.applyingForClass,
            academicYear: academicYear,

            // Parent Info
            fatherName: (validatedData as any).parentName,
            motherName: body.motherName || "Not Provided",
            primaryContact: validatedData.phone,
            alternateContact: body.alternateContact || null,
            email: validatedData.email,

            // Address
            address: (validatedData as any).address,
            city: (validatedData as any).city,
            pincode: body.pincode || "000000",

            // Previous Academic Info
            previousSchool: (validatedData as any).previousSchool || null,
            previousClass: (validatedData as any).lastClassAttended || null,
            previousStream: (validatedData as any).percentage ? `Percentage: ${(validatedData as any).percentage}` : null,
            transferCertificate: false,

            // Document Uploads
            documents: body.documents || [],
            adminNotes: isQuickForm ? "Submitted via Quick Admission Form on Academic Page" : body.adminNotes,
        });

        // Trigger WhatsApp Notification
        sendWhatsApp(
            admission.primaryContact,
            templates.admissionReceived(
                admission.studentName,
                admission.applicationNo,
                admission.applyingForClass
            )
        ).catch(err => console.error("WhatsApp notification failed:", err));

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully",
            applicationNo: admission.applicationNo,
        });
    } catch (error: any) {
        console.error("Admission Submission Error:", error);

        if (error.name === "ZodError") {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
