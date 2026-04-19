"use client";

import React from "react";
import { UtilityPageLayout } from "@/components/layout/UtilityPageLayout";
import { FileText } from "lucide-react";

export default function TermsOfUsePage() {
    return (
        <UtilityPageLayout
            title="Terms of Use"
            subtitle="Legal Framework"
            description="The terms and conditions governing the use of the MP Public School digital platform and services."
            icon="file-text"
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-600 leading-relaxed">
                        By accessing and searching this website, you represent that you have read, understood, and agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">2. Use License</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Permission is granted to temporarily download one copy of the materials (information or software) on MP Public School's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Modify or copy the materials;</li>
                        <li>Use the materials for any commercial purpose, or for any public display;</li>
                        <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                        <li>Remove any copyright or other proprietary notations from the materials;</li>
                        <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">3. Code of Conduct</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Users of our portal must adhere to institutional guidelines. Any attempt to disrupt service, upload malicious content, or engage in unauthorized data scraping will lead to immediate termination of access and potential legal action.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">4. Academic Accuracy</h2>
                    <p className="text-gray-600 leading-relaxed">
                        While we strive to keep all academic information (syllabus, schedules, fees) up to date, the physical records held at the School Registrar's office shall be considered the final authority in case of any discrepancies.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">5. Governing Law</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Any claim relating to MP Public School's website shall be governed by the laws of India, specifically under the jurisdiction of the courts in New Delhi, without regard to its conflict of law provisions.
                    </p>
                </section>

                <div className="pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400">Last Updated: April 2026</p>
                </div>
            </div>
        </UtilityPageLayout>
    );
}
