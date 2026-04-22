import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Admin Panel | School Management System",
    description: "Secure administrative dashboard for school management.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} antialiased font-sans`} cz-shortcut-listen="true">
                <AuthProvider>
                    {children}
                    <Toaster position="top-right" />
                </AuthProvider>
            </body>
        </html>
    );
}
