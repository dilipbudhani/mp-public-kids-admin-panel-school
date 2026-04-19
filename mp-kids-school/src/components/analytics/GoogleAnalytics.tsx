"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as gtag from "@/lib/gtag";
import * as fbq from "@/lib/fbpixel";

export default function Analytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
            gtag.pageview(url);
            fbq.pageview();
        }
    }, [pathname, searchParams]);

    return null;
}
