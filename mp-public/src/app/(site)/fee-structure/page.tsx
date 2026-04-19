import React from 'react';
import { dbConnect } from "@/lib/mongodb";
import FeeStructure from "@/models/FeeStructure";
import StaticPage from "@/models/StaticPage";
import FeeClient from "@/components/fees/FeeClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fee Structure | MP Public School',
    description: 'Transparent fee structure and payment policies for MP Public School.',
};

// Fallback data if DB is empty
const fallbackData = {
    academicYear: '2025-26',
    categories: [
        {
            id: 'pre-primary',
            label: 'Pre-Primary',
            fees: [
                { head: 'Admission Fee', amount: '5,000', frequency: 'One-time', notes: 'For new admissions only' },
                { head: 'Tuition Fee', amount: '2,800', frequency: 'Monthly', notes: 'Payable quarterly' },
                { head: 'Annual Charges', amount: '4,500', frequency: 'Annually', notes: 'Includes insurance & diary' },
                { head: 'Development Fund', amount: '2,000', frequency: 'Annually', notes: 'Facility maintenance' },
                { head: 'Computer Fee', amount: 'N/A', frequency: '-', notes: '-' },
            ]
        },
        {
            id: 'primary',
            label: 'Primary (1-5)',
            fees: [
                { head: 'Admission Fee', amount: '5,000', frequency: 'One-time', notes: 'For new admissions only' },
                { head: 'Tuition Fee', amount: '3,200', frequency: 'Monthly', notes: 'Payable quarterly' },
                { head: 'Annual Charges', amount: '5,500', frequency: 'Annually', notes: 'Resource materials & events' },
                { head: 'Development Fund', amount: '2,500', frequency: 'Annually', notes: 'Facility maintenance' },
                { head: 'Exam Fee', amount: '1,200', frequency: 'Annually', notes: 'End of session exams' },
                { head: 'Library Fee', amount: '500', frequency: 'Annually', notes: 'Access to physical & digital library' },
                { head: 'Computer Fee', amount: '400', frequency: 'Monthly', notes: 'Smart class & lab access' },
            ]
        },
        {
            id: 'middle',
            label: 'Middle (6-8)',
            fees: [
                { head: 'Admission Fee', amount: '5,000', frequency: 'One-time', notes: 'For new admissions only' },
                { head: 'Tuition Fee', amount: '3,800', frequency: 'Monthly', notes: 'Payable quarterly' },
                { head: 'Annual Charges', amount: '6,500', frequency: 'Annually', notes: 'Includes sports & activities' },
                { head: 'Development Fund', amount: '3,000', frequency: 'Annually', notes: 'Infrastructure विकास' },
                { head: 'Exam Fee', amount: '1,500', frequency: 'Annually', notes: 'Mid-term & Annual exams' },
                { head: 'Library Fee', amount: '800', frequency: 'Annually', notes: 'Advanced resources access' },
                { head: 'Lab Fee (Science)', amount: '600', frequency: 'Monthly', notes: 'Practical sessions' },
                { head: 'Computer Fee', amount: '500', frequency: 'Monthly', notes: 'Coding & Robotics' },
            ]
        },
        {
            id: 'secondary',
            label: 'Secondary (9-10)',
            fees: [
                { head: 'Admission Fee', amount: '5,000', frequency: 'One-time', notes: 'For new admissions only' },
                { head: 'Tuition Fee', amount: '4,500', frequency: 'Monthly', notes: 'Payable quarterly' },
                { head: 'Annual Charges', amount: '7,500', frequency: 'Annually', notes: 'Board registration support' },
                { head: 'Development Fund', amount: '3,500', frequency: 'Annually', notes: 'Upgraded facilities' },
                { head: 'Exam Fee', amount: '2,000', frequency: 'Annually', notes: 'Includes Pre-boards' },
                { head: 'Lab Fee', amount: '800', frequency: 'Monthly', notes: 'Composite Science Lab' },
                { head: 'Computer Fee', amount: '600', frequency: 'Monthly', notes: 'IT & AI subjects' },
            ]
        },
        {
            id: 'sr-secondary',
            label: 'Sr. Secondary (11-12)',
            fees: [
                { head: 'Admission Fee', amount: '5,000', frequency: 'One-time', notes: 'For new admissions only' },
                { head: 'Tuition Fee', amount: '5,500', frequency: 'Monthly', notes: 'Stream specific' },
                { head: 'Annual Charges', amount: '8,500', frequency: 'Annually', notes: 'Career counseling included' },
                { head: 'Development Fund', amount: '4,000', frequency: 'Annually', notes: 'High-tech infrastructure' },
                { head: 'Exam Fee', amount: '2,500', frequency: 'Annually', notes: 'Practical & Theory exams' },
                { head: 'Lab Fee (PCB/PCM)', amount: '1,200', frequency: 'Monthly', notes: 'Physics/Chem/Bio labs' },
                { head: 'Library Fee', amount: '1,000', frequency: 'Annually', notes: 'Reference section access' },
            ]
        }
    ],
    transportZones: [
        { zone: 'Zone A', area: 'Within 3 KM (City Core)', fee: '1,200' },
        { zone: 'Zone B', area: '3-6 KM (Suburbs North)', fee: '1,800' },
        { zone: 'Zone C', area: '6-9 KM (East/West Extension)', fee: '2,400' },
        { zone: 'Zone D', area: '9-12 KM (Industrial Belt)', fee: '3,000' },
        { zone: 'Zone E', area: '12-15 KM (Satellite Town)', fee: '3,600' },
        { zone: 'Zone F', area: 'Night Halt (Remote Areas)', fee: '4,500' },
    ],
    paymentMethods: [
        {
            name: 'Online Payment',
            iconName: 'Smartphone',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            note: 'Quick and secure via Net Banking, UPI (GPay/PhonePe), or Credit/Debit Cards.'
        },
        {
            name: 'Cheque/DD',
            iconName: 'CreditCard',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            note: 'Drawn in favor of "MP Public School" payable at local branch.'
        },
        {
            name: 'Cash',
            iconName: 'Banknote',
            color: 'text-green-600',
            bg: 'bg-green-50',
            note: 'Acceptable at the School Accounts Office during working hours (9 AM - 2 PM).'
        }
    ],
    importantNotes: [
        { title: 'Payment Schedule', text: 'Fees are collected on a quarterly basis. Quarters start in April, July, October, and January.' },
        { title: 'Late Fee Policy', text: 'A late fee of ₹50 per day will be applicable if fees are not paid within the first 10 working days of the quarter month.' },
        { title: 'Sibling Concession', text: 'A 10% concession on tuition fees is provided to the younger sibling as long as both siblings are enrolled.' },
        { title: 'Fee Revision', text: 'Fees are subject to an annual revision of 5-10% as approved by the School Management Committee.' },
        { title: 'Refund Policy', text: 'Admission fees and annual charges are non-refundable. Tuition fees for the remaining months of a quarter may be refunded upon withdrawal.' }
    ]
};

async function getFees() {
    try {
        await dbConnect();
        const data = await FeeStructure.findOne().sort({ createdAt: -1 }).lean();
        // If no data or no categories exist in the DB, show fallback content
        if (!data || !(data as any).categories || (data as any).categories.length === 0) {
            return fallbackData;
        }

        // Ensure IDs are present for categories (Fallback for older data if any)
        const categories = (data as any).categories.map((cat: any) => ({
            ...cat,
            id: cat.id || cat._id.toString(),
            fees: cat.fees.map((f: any) => ({
                ...f,
                id: f._id?.toString()
            }))
        }));

        return {
            ...data,
            categories,
            _id: (data as any)._id.toString(),
        } as any;
    } catch (error) {
        console.error("GET_FEES_ERROR", error);
        return fallbackData;
    }
}

export default async function FeeStructurePage() {
    const feeData = await FeeStructure.findOne({ schoolIds: process.env.SCHOOL_ID }).sort({ createdAt: -1 }).lean() || fallbackData;
    const pageData = await StaticPage.findOne({ slug: 'fee-structure', schoolIds: process.env.SCHOOL_ID }).lean();

    // Remove any hardcoded year (like "2025-26") from the CMS title so it doesn't duplicate the dynamic academic year
    const rawHeroTitle = (pageData as any)?.title || 'Fee Structure';
    const heroTitle = rawHeroTitle.replace(/\s*\d{4}-\d{2}\s*/g, '');

    const heroDescription = (pageData as any)?.description || 'We believe in maintaining complete transparency regarding school costs. Our fee structure is designed to reflect the quality of education and facilities provided.';

    return (
        <FeeClient
            categories={feeData.categories}
            transportZones={feeData.transportZones || []}
            paymentMethods={feeData.paymentMethods || []}
            importantNotes={feeData.importantNotes || []}
            academicYear={feeData.academicYear}
            heroTitle={heroTitle}
            heroDescription={heroDescription}
        />
    );
}
