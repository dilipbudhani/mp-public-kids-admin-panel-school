import { DisclosureTable } from '@/components/disclosure/DisclosureTable';
import { PrintButton } from '@/components/disclosure/PrintButton';
import * as motion from 'framer-motion/client';
import { FileText, ShieldCheck } from 'lucide-react';
import { dbConnect } from '@/lib/mongodb';
import Disclosure from '@/models/Disclosure';

import StaticPage from '@/models/StaticPage';

export const metadata = {
    title: 'CBSE Disclosure | MP Public School',
    description: 'Mandatory public disclosure as per CBSE affiliation norms and transparency data for MP Public School.',
};

export default async function CBSEDisclosurePage() {
    await dbConnect();
    const [allDisclosures, pageData] = await Promise.all([
        Disclosure.find({ schoolIds: process.env.SCHOOL_ID }).sort({ order: 1 }).lean(),
        StaticPage.findOne({ slug: "cbse-disclosure", schoolIds: process.env.SCHOOL_ID }).lean()
    ]);

    // Helper to filter and map sections
    const getSectionRows = (section: string, isResult = false) => {
        const items = allDisclosures.filter((d: any) => d.section === section);
        if (isResult) {
            return items.map((d: any) => [d.label, d.value, d.value2 || 'N/A', d.value3 || 'N/A']);
        }
        return items.map((d: any) => [d.label, d.value]);
    };

    // 1. General Information
    const generalInfo = getSectionRows('GENERAL');

    // 2. Documents & Certificates
    const documentItems = allDisclosures.filter((d: any) => d.section === 'DOCUMENTS');

    // 3. Result & Academics
    const resultClass10 = getSectionRows('RESULT_10', true);
    const resultClass12 = getSectionRows('RESULT_12', true);

    // 4. Staff Details
    const staffRows = getSectionRows('STAFF');

    // 5. School Infrastructure
    const infraRows = getSectionRows('INFRASTRUCTURE');

    // 6. Fee Structure
    const feeRows = getSectionRows('FEE');

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section data-hero-dark="true" className="relative h-[350px] flex items-center bg-primary overflow-hidden pt-32 pb-16 print:hidden">
                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 text-gold mb-4">
                            <FileText className="w-8 h-8" />
                            <span className="text-sm font-bold tracking-[0.3em] uppercase">Compliance & Transparency</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            {pageData?.title || "Mandatory Public Disclosure"}
                        </h1>
                        <p className="text-xl text-white/70 font-inter leading-relaxed max-w-2xl">
                            {pageData?.description || "Appendix IX | CBSE Affiliation Norms and School Transparency Data"}
                        </p>
                    </motion.div>
                </div>

                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
            </section>

            <main className="py-12 print:bg-white print:py-0">
                <div className="container print:max-w-full print:px-0 print:mx-0">
                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center mb-12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm gap-6 print:mb-8 print:p-0 print:border-none print:shadow-none">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="text-center lg:text-left">
                                <h2 className="text-2xl font-playfair font-bold text-primary print:text-black">
                                    {pageData?.sections?.find((s: any) => s.title === 'Official School Record')?.title || "Official School Record"}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">
                                    {pageData?.sections?.find((s: any) => s.title === 'Official School Record')?.content || "As per CBSE Circular No. CBSE/Aff./4/2021"}
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <PrintButton />
                        </div>
                    </div>

                    {/* Section 1: General Information */}
                    <div className="mb-12 bg-white p-6 shadow-subtle border border-gray-200 print:shadow-none print:border-none print:p-0 print:mb-8">
                        <DisclosureTable
                            title="A : GENERAL INFORMATION"
                            headers={['INFORMATION', 'DETAILS']}
                            rows={generalInfo.length > 0 ? generalInfo : [['No data available', 'Contact administration']]}
                        />
                    </div>

                    {/* Section 2: Documents & Information */}
                    <div className="mb-12 bg-white p-6 shadow-subtle border border-gray-200 print:shadow-none print:border-none print:p-0 print:mb-8">
                        <h3 className="text-xl font-bold bg-primary text-white p-3 border-x border-t border-primary print:bg-gray-100 print:text-black">
                            B : DOCUMENTS AND INFORMATION
                        </h3>
                        <table className="min-w-full border-collapse border border-primary print:border-black">
                            <thead>
                                <tr className="bg-slate-100 print:bg-transparent text-primary print:text-black">
                                    <th className="border border-primary p-3 text-left font-bold print:border-black w-[70%]">
                                        DOCUMENTS/INFORMATION
                                    </th>
                                    <th className="border border-primary p-3 text-left font-bold print:border-black">
                                        STATUS / LINK
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {documentItems.length > 0 ? documentItems.map((item: any) => (
                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="border border-primary p-3 text-sm text-text print:border-black">
                                            {item.label}
                                        </td>
                                        <td className="border border-primary p-3 text-sm font-semibold text-primary hover:underline print:border-black print:text-black">
                                            {item.link ? (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                    {item.value || 'View Document'}
                                                </a>
                                            ) : (
                                                <span className="text-green-600">{item.value}</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={2} className="border border-primary p-4 text-center text-gray-500 italic">
                                            No documents uploaded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <p className="mt-4 text-xs text-muted italic print:text-black">
                            NOTE: THE SCHOOLS NEEDS TO UPLOAD THE SELF ATTESTED COPIES OF ABOVE LISTED DOCUMETNS BY CHAIRMAN/MANAGER/SECRETARY AND PRINCIPAL. IN CASE, IT IS NOTICED AT LATER STAGE THAT UPLOADED DOCUMENTS ARE NOT GENUINE THEN SCHOOL SHALL BE LIABLE FOR ACTION AS PER NORMS.
                        </p>
                    </div>

                    {/* Section 3: Result & Academics */}
                    <div className="mb-12 bg-white p-6 shadow-subtle border border-gray-200 print:shadow-none print:border-none print:p-0 print:mb-8">
                        <h3 className="text-xl font-bold bg-primary text-white p-3 border-x border-t border-primary mb-4 print:bg-gray-100 print:text-black">
                            C : RESULT AND ACADEMICS
                        </h3>

                        <DisclosureTable
                            title="RESULT CLASS: X"
                            headers={['YEAR', 'NO. OF REGISTERED STUDENTS', 'NO. OF STUDENTS PASSED', 'PASS PERCENTAGE']}
                            rows={resultClass10.length > 0 ? resultClass10 : [['-', '-', '-', '-']]}
                        />

                        <DisclosureTable
                            title="RESULT CLASS: XII"
                            headers={['YEAR', 'NO. OF REGISTERED STUDENTS', 'NO. OF STUDENTS PASSED', 'PASS PERCENTAGE']}
                            rows={resultClass12.length > 0 ? resultClass12 : [['-', '-', '-', '-']]}
                        />
                    </div>

                    {/* Section 4: Staff Details */}
                    <div className="mb-12 bg-white p-6 shadow-subtle border border-gray-200 print:shadow-none print:border-none print:p-0 print:mb-8">
                        <DisclosureTable
                            title="D : STAFF (TEACHING)"
                            headers={['INFORMATION', 'DETAILS']}
                            rows={staffRows.length > 0 ? staffRows : [['No data available', '-']]}
                        />
                    </div>

                    {/* Section 5: School Infrastructure */}
                    <div className="mb-12 bg-white p-6 shadow-subtle border border-gray-200 print:shadow-none print:border-none print:p-0 print:mb-8">
                        <DisclosureTable
                            title="E : SCHOOL INFRASTRUCTURE"
                            headers={['INFORMATION', 'DETAILS']}
                            rows={infraRows.length > 0 ? infraRows : [['No data available', '-']]}
                        />
                    </div>

                    {/* Section 6: Fee Structure */}
                    <div className="mb-24 bg-white p-6 shadow-subtle border border-gray-200 print:shadow-none print:border-none print:p-0 print:mb-8">
                        <DisclosureTable
                            title="F : ANNUAL FEE STRUCTURE"
                            headers={['CLASS', 'ANNUAL FEE (APPROX)']}
                            rows={feeRows.length > 0 ? feeRows : [['No data available', '-']]}
                        />
                    </div>

                    {/* Print only footer */}
                    <div className="hidden print:block text-center text-xs text-muted mt-8 border-t pt-4 print:text-black border-black">
                        <p>© {new Date().getFullYear()} MP Public School. All rights reserved.</p>
                        <p>Generated for Mandatory Public Disclosure compliance.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
