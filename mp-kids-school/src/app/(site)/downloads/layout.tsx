import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Downloads & Resources | MP Kids School",
    description: "Access school forms, academic documents, circulars, and other resources for MP Kids School.",
};

export default function DownloadsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
