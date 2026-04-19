"use client";

import React from "react";
import { UtilityPageLayout } from "@/components/layout/UtilityPageLayout";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <UtilityPageLayout
            title="Privacy Policy"
            subtitle="Data Protection"
            description="Our commitment to safeguarding the privacy of our students, parents, and staff in the digital age."
            icon="shield"
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Introduction</h2>
                    <p className="text-gray-600 leading-relaxed">
                        MP Kids School ("the School") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Information We Collect</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        We collect several types of information from and about users of our Website, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li><strong>Personal Information:</strong> Name, postal address, e-mail address, telephone number, or any other identifier by which you may be contacted online or offline.</li>
                        <li><strong>Academic Information:</strong> Student enrollment details, academic records, and progress reports when accessed through secure portals.</li>
                        <li><strong>Usage Data:</strong> Information about your internet connection, the equipment you use to access our Website, and usage details.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">How We Use Your Information</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        We use information that we collect about you or that you provide to us, including any personal information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>To provide you with information, products, or services that you request from us.</li>
                        <li>To fulfill any other purpose for which you provide it (e.g., student admission queries).</li>
                        <li>To notify you about changes to our School or any services we offer or provide though it.</li>
                        <li>To provide parents and students with academic updates and school notices.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Data Security</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Changes to Our Privacy Policy</h2>
                    <p className="text-gray-600 leading-relaxed">
                        It is our policy to post any changes we make to our privacy policy on this page. The date the privacy policy was last revised is identified at the top of the page.
                    </p>
                </section>

                <div className="pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400">Last Updated: April 2026</p>
                </div>
            </div>
        </UtilityPageLayout>
    );
}
