"use client";

import React from "react";
import { UtilityPageLayout } from "@/components/layout/UtilityPageLayout";
import { Info } from "lucide-react";

export default function DisclaimerPage() {
    return (
        <UtilityPageLayout
            title="Disclaimer"
            subtitle="Content Policy"
            description="Clarifications regarding the information provided on our website and its official standing."
            icon="info"
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">External Links</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with MP Kids School. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Educational Representations</h2>
                    <p className="text-gray-600 leading-relaxed">
                        The information provided by MP Kids School on this website is for general informational purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Admissions and Fees</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Information regarding admissions, fees, and institutional policies is subject to change at the discretion of the School Management. The publication of fees or admission criteria on this website does not constitute a legally binding contract until the official admission process is completed.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-playfair font-bold text-primary mb-4">No Liability</h2>
                    <p className="text-gray-600 leading-relaxed">
                        In no event will MP Kids School be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
                    </p>
                </section>

                <div className="pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400">Last Updated: April 2026</p>
                </div>
            </div>
        </UtilityPageLayout>
    );
}
