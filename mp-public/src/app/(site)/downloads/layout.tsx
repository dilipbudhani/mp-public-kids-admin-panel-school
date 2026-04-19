import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Downloads & Resources | MP Public School",
    description: "Access school forms, academic documents, circulars, and other resources for MP Public School.",
};

export default function DownloadsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
